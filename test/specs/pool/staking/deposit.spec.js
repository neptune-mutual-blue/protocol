/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { minutesToBlocks } = require('../../../../util/block-time')
const { mineBlocks } = require('../../../../util/block')
const pair = require('../../../../util/composer/uniswap-pair')
const { deployDependencies, PoolTypes } = require('./deps')
const cache = null
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Deposit to Staking Pool', () => {
  let pool, payload, deployed, dai, npmDai, sabre, sabreDai

  before(async () => {
    deployed = await deployDependencies()

    const [owner] = await ethers.getSigners()
    dai = await deployer.deploy(cache, 'FakeToken', 'DAI', 'DAI', helper.ether(100_000_000, PRECISION), PRECISION)
    ;[[npmDai]] = await pair.deploySeveral(cache, [{ token0: deployed.npm, token1: dai }])
    sabre = await deployer.deploy(cache, 'FakeToken', 'Sabre Oracles', 'SABRE', helper.ether(100_000_000), 18)
    ;[[sabreDai]] = await pair.deploySeveral(cache, [{ token0: sabre, token1: dai }])

    pool = await deployer.deployWithLibraries(cache, 'StakingPools', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      StakingPoolCoreLibV1: deployed.stakingPoolCoreLibV1.address,
      StakingPoolLibV1: deployed.stakingPoolLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, owner.address)
    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)
    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, deployed.protocol.address)
    await deployed.protocol.addContract(key.PROTOCOL.CNS.STAKING_POOL, pool.address)

    payload = {
      key: key.toBytes32('NPM Staking Pool'),
      name: 'NPM Staking Pool',
      poolType: PoolTypes.Token,
      stakingToken: deployed.npm.address,
      uniStakingTokenDollarPair: npmDai.address,
      rewardToken: sabre.address,
      uniRewardTokenDollarPair: sabreDai.address,
      stakingTarget: helper.ether(4_000_000),
      maxStake: helper.ether(10_000),
      platformFee: helper.percentage(0.5),
      rewardPerBlock: (12_345_678).toString(),
      lockupPeriod: minutesToBlocks(31337, 5),
      rewardTokenToDeposit: helper.ether(10_000_000)
    }

    await sabre.approve(pool.address, ethers.constants.MaxUint256)
    await pool.addOrEditPool(payload)
  })

  it('must allow deposits', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.npm.transfer(bob.address, helper.ether(1_000_000))
    const amount = helper.ether(10_000)

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(payload.key, amount)
  })

  it('must not revert on multiple deposits', async () => {
    await mineBlocks(10)

    const [, bob] = await ethers.getSigners()
    await deployed.npm.transfer(bob.address, helper.ether(1_000_000))
    const amount = helper.ether(10_000)

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(payload.key, amount)
  })

  it('must revert if zero amount is deposited', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.npm.transfer(bob.address, helper.ether(1_000_000))
    const amount = helper.ether(0)

    await pool.connect(bob).deposit(payload.key, amount).should.be.rejectedWith('Enter an amount')
  })

  it('must revert if a very large amount is deposited', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.npm.transfer(bob.address, helper.ether(1_000_000))
    const amount = helper.ether(100_000)

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(payload.key, amount).should.be.rejectedWith('Stake too high')
  })

  it('must revert if the protocol is paused', async () => {
    const [owner, bob] = await ethers.getSigners()
    await deployed.npm.transfer(bob.address, helper.ether(1_000_000))
    const amount = helper.ether(10_000)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.PAUSE_AGENT, owner.address)
    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UNPAUSE_AGENT, owner.address)

    await deployed.protocol.pause()

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(payload.key, amount).should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })

  it('must revert if an invalid pool key is specified', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.npm.transfer(bob.address, helper.ether(1_000_000))
    const amount = helper.ether(10_000)

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(key.toBytes32('Foobar'), amount).should.be.rejectedWith('Pool invalid or closed')
  })
})
