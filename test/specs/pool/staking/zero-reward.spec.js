/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { minutesToBlocks } = require('../../../../util/block-time')
const { mineBlocks } = require('../../../../util/block')
const pair = require('../../../../util/composer/uniswap-pair')
const { deployDependencies, PoolTypes } = require('./deps')
const cache = null
const { expect } = require('chai')

const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Zero Rewards: when tokens run out of supply', () => {
  let pool, payload, deployed, dai, npmDai, sabre, sabreDai

  before(async () => {
    deployed = await deployDependencies()

    const [owner, bob] = await ethers.getSigners()
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
        helper.percentage(0), // Platform fee
        helper.ether(1), // Reward per block
        minutesToBlocks(31337, 1), // 5 minutes lockup period
        helper.ether(1) // Deposit 10M sabre tokens
      ]
    }

    await sabre.approve(pool.address, ethers.constants.MaxUint256)
    await pool.addOrEditPool(payload.key, payload.name, payload.poolType, payload.addresses, payload.values)

    await deployed.npm.transfer(bob.address, helper.ether(1_000_000))
    const amount = helper.ether(10_000)

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(payload.key, amount)
  })

  it('must have zero reward if the reward tokens run out of supply', async () => {
    await mineBlocks(12)
    const [, bob] = await ethers.getSigners()

    let tx = await pool.connect(bob).withdrawRewards(payload.key)
    let { events } = await tx.wait()
    let event = events.find(x => x.event === 'RewardsWithdrawn')

    event.args.rewards.should.be.gt('0')
    event.args.platformFee.should.equal('0')

    tx = await pool.connect(bob).withdrawRewards(payload.key)
    events = (await tx.wait()).events
    event = events.find(x => x.event === 'RewardsWithdrawn')

    expect(event).to.be.undefined
  })
})

describe('Zero Rewards: if the protocol is misconfigured', () => {
  let pool, payload, deployed, dai, npmDai, sabre, sabreDai

  before(async () => {
    deployed = await deployDependencies()

    const [owner, bob] = await ethers.getSigners()
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
        helper.percentage(100), // Platform fee
        helper.ether(1), // Reward per block
        minutesToBlocks(31337, 1), // 5 minutes lockup period
        helper.ether(1) // Deposit 10M sabre tokens
      ]
    }

    await sabre.approve(pool.address, ethers.constants.MaxUint256)
    await pool.addOrEditPool(payload.key, payload.name, payload.poolType, payload.addresses, payload.values)

    await deployed.npm.transfer(bob.address, helper.ether(1_000_000))
    const amount = helper.ether(10_000)

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(payload.key, amount)
  })

  it('must have zero reward if the protocol fee is 100%', async () => {
    await mineBlocks(12)
    const [, bob] = await ethers.getSigners()

    const tx = await pool.connect(bob).withdrawRewards(payload.key)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'RewardsWithdrawn')

    event.args.rewards.should.be.gt('0')
    event.args.platformFee.should.be.gt('0')
  })
})
