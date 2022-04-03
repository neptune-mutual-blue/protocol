/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { minutesToBlocks } = require('../../../../util/block-time')
const { mineBlocks } = require('../../../../util/block')
const pair = require('../../../../util/composer/uniswap-pair')
const { deployDependencies, PoolTypes } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Withdraw Staked Tokens', () => {
  let pool, payload, deployed, dai, npmDai, sabre, sabreDai

  before(async () => {
    deployed = await deployDependencies()

    const [owner, bob] = await ethers.getSigners()
    dai = await deployer.deploy(cache, 'FakeToken', 'DAI', 'DAI', helper.ether(100_000_000))
    ;[[npmDai]] = await pair.deploySeveral(cache, [{ token0: deployed.npm.address, token1: dai.address }])
    sabre = await deployer.deploy(cache, 'FakeToken', 'Sabre Oracles', 'SABRE', helper.ether(100_000_000))
    ;[[sabreDai]] = await pair.deploySeveral(cache, [{ token0: sabre.address, token1: dai.address }])

    pool = await deployer.deployWithLibraries(cache, 'StakingPools', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      StakingPoolCoreLibV1: deployed.stakingPoolCoreLibV1.address,
      StakingPoolLibV1: deployed.stakingPoolLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)
    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, deployed.protocol.address)
    await deployed.protocol.addContract(key.PROTOCOL.CNS.STAKING_POOL, pool.address)

    payload = {
      key: key.toBytes32('NPM Staking Pool'),
      name: 'NPM Staking Pool',
      poolType: PoolTypes.Token,
      addresses: [
        deployed.npm.address, // Staking Token
        npmDai.address, // uniStakingTokenDollarPair
        sabre.address, // rewardToken
        sabreDai.address // uniRewardTokenDollarPair
      ],
      values: [
        helper.ether(4_000_000), // 4M NPM target
        helper.ether(10_000), // Max 10_000 per transaction
        helper.percentage(0.5), // Platform fee
        (1e18).toString(), // Reward per block
        minutesToBlocks(31337, 1), // 5 minutes lockup period
        helper.ether(1) // Deposit 1 sabre tokens
      ]
    }

    await sabre.approve(pool.address, ethers.constants.MaxUint256)
    await pool.addOrEditPool(payload.key, payload.name, payload.poolType, payload.addresses, payload.values)

    await deployed.npm.transfer(bob.address, helper.ether(1_000_000))
    const amount = helper.ether(10_000)

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(payload.key, amount)
  })

  it('must revert if withdrawal is too early', async () => {
    const [, bob] = await ethers.getSigners()
    await pool.connect(bob).withdraw(payload.key, helper.ether(10_000)).should.be.rejectedWith('Withdrawal too early')
  })

  it('must withdraw without any errors', async () => {
    const [, bob] = await ethers.getSigners()

    await mineBlocks(payload.values[4])

    const tx = await pool.connect(bob).withdraw(payload.key, helper.ether(10))
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'RewardsWithdrawn')

    event.args.rewards.should.be.gt('0')
    event.args.platformFee.should.be.gt('0')
  })

  it('must allow multiple withdrawals', async () => {
    const [, bob] = await ethers.getSigners()

    await mineBlocks(payload.values[4])

    await pool.connect(bob).withdraw(payload.key, helper.ether(10))
    await pool.connect(bob).withdraw(payload.key, helper.ether(10))
  })

  it('must revert if zero amount is withdrawn', async () => {
    const [, bob] = await ethers.getSigners()
    await pool.connect(bob).withdraw(payload.key, helper.ether(0))
      .should.be.rejectedWith('Please specify amount')
  })

  it('must revert if withdrawal amount is greater than staken', async () => {
    const [, bob] = await ethers.getSigners()
    await pool.connect(bob).withdraw(payload.key, helper.ether(10_001))
      .should.be.rejectedWith('Insufficient balance')
  })

  it('must revert if the protocol is paused', async () => {
    const [owner, bob] = await ethers.getSigners()

    await deployed.protocol.grantRoles([{ account: owner.address, roles: [key.ACCESS_CONTROL.PAUSE_AGENT, key.ACCESS_CONTROL.UNPAUSE_AGENT] }])

    await deployed.protocol.pause()

    await pool.connect(bob).withdraw(payload.key, helper.ether(10))
      .should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })

  it('must revert if an invalid pool key is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await pool.connect(bob).withdraw(payload.key, helper.ether(10))

    await pool.connect(bob).withdraw(key.toBytes32('Foobar'), helper.ether(10))
      .should.be.rejectedWith('Pool invalid or closed')
  })
})
