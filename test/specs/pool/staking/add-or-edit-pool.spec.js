/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { minutesToBlocks } = require('../../../../util/block-time')
const pair = require('../../../../util/composer/uniswap-pair')
const { deployDependencies, PoolTypes } = require('./deps')
const cache = null
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Add or Edit Pool', () => {
  let pool, deployed, stablecoin, npmStablecoinPair, payload, sabre, sabreStablecoinPair

  before(async () => {
    deployed = await deployDependencies()

    const [owner] = await ethers.getSigners()
    stablecoin = await deployer.deploy(cache, 'FakeToken', 'USDC', 'USDC', helper.ether(100_000_000, PRECISION), PRECISION)
    ;[[npmStablecoinPair]] = await pair.deploySeveral(cache, [{ token0: deployed.npm, token1: stablecoin }])
    sabre = await deployer.deploy(cache, 'FakeToken', 'Sabre Oracles', 'SABRE', helper.ether(100_000_000), 12)
    ;[[sabreStablecoinPair]] = await pair.deploySeveral(cache, [{ token0: sabre, token1: stablecoin }])

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
      stakingToken: deployed.npm.address,
      uniStakingTokenDollarPair: npmStablecoinPair.address,
      rewardToken: sabre.address,
      uniRewardTokenDollarPair: sabreStablecoinPair.address,
      stakingTarget: helper.ether(4_000_000),
      maxStake: helper.ether(10_000),
      platformFee: helper.percentage(0.5),
      rewardPerBlock: (12_345_678).toString(),
      lockupPeriod: minutesToBlocks(31338, 5),
      rewardTokenToDeposit: helper.ether(10_000_000)
    }
  })

  it('must correctly add a new pool', async () => {
    const [owner, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.rewardTokenToDeposit)
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)
    const tx = await pool.connect(bob).addOrEditPool(payload)

    await deployed.protocol.revokeRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    const { events } = await tx.wait()
    const event = events.pop()

    event.args.key.should.equal(payload.key)
    event.args.args.name.should.equal(payload.name)
    event.args.args.poolType.should.equal(payload.poolType)
    event.args.args.stakingToken.should.equal(deployed.npm.address)
    event.args.args.uniStakingTokenDollarPair.should.equal(npmStablecoinPair.address)
    event.args.args.rewardToken.should.equal(sabre.address)
    event.args.args.uniRewardTokenDollarPair.should.equal(sabreStablecoinPair.address)
    event.args.args.rewardTokenToDeposit.should.equal(payload.rewardTokenToDeposit)
    event.args.args.maxStake.should.equal(payload.maxStake)
    event.args.args.platformFee.should.equal(payload.platformFee)
    event.args.args.rewardPerBlock.should.equal(payload.rewardPerBlock)
    event.args.args.lockupPeriod.should.equal(payload.lockupPeriod)

    const info = await pool.getInfo(payload.key, owner.address)

    info.name.should.equal(payload.name)
    info.stakingToken.should.equal(deployed.npm.address)
    info.stakingTokenStablecoinPair.should.equal(npmStablecoinPair.address)
    info.rewardToken.should.equal(sabre.address)
    info.rewardTokenStablecoinPair.should.equal(sabreStablecoinPair.address)
    info.totalStaked.should.equal('0')
    info.target.should.equal(payload.stakingTarget)
    info.maximumStake.should.equal(payload.maxStake)
    info.stakeBalance.should.equal('0')
    info.cumulativeDeposits.should.equal('0')
    info.rewardPerBlock.should.equal(payload.rewardPerBlock)
    info.platformFee.should.equal(payload.platformFee)
    info.lockupPeriod.should.equal(payload.lockupPeriod)
    info.rewardTokenBalance.should.equal(payload.rewardTokenToDeposit)
    info.accountStakeBalance.should.equal('0')
  })

  it('must correct edit an existing pool', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.rewardTokenToDeposit)
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      name: '',
      stakingTarget: '0',
      maxStake: '0',
      platformFee: '0',
      rewardPerBlock: '0',
      lockupPeriod: '0',
      rewardTokenToDeposit: '0'
    })

    const info = await pool.getInfo(payload.key, bob.address)

    info.name.should.equal(payload.name)
    info.stakingToken.should.equal(deployed.npm.address)
    info.stakingTokenStablecoinPair.should.equal(npmStablecoinPair.address)
    info.rewardToken.should.equal(sabre.address)
    info.rewardTokenStablecoinPair.should.equal(sabreStablecoinPair.address)
    info.totalStaked.should.equal('0')
    info.target.should.equal(payload.stakingTarget)
    info.maximumStake.should.equal(payload.maxStake)
    info.stakeBalance.should.equal('0')
    info.cumulativeDeposits.should.equal('0')
    info.rewardPerBlock.should.equal(payload.rewardPerBlock)
    info.platformFee.should.equal(payload.platformFee)
    info.lockupPeriod.should.equal(payload.lockupPeriod)
    info.rewardTokenBalance.should.equal(payload.rewardTokenToDeposit)
    info.accountStakeBalance.should.equal('0')
  })

  it('must fail if the protocol is paused', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.lockupPeriod)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)
    await deployed.protocol.revokeRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.PAUSE_AGENT, bob.address)
    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UNPAUSE_AGENT, bob.address)
    await deployed.protocol.connect(bob).pause()

    await pool.connect(bob).addOrEditPool(payload).should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.connect(bob).unpause()

    await deployed.protocol.revokeRole(key.ACCESS_CONTROL.PAUSE_AGENT, bob.address)
    await deployed.protocol.revokeRole(key.ACCESS_CONTROL.UNPAUSE_AGENT, bob.address)
  })

  it('must fail if accessed by a non admin', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.lockupPeriod)
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await pool.connect(bob).addOrEditPool(payload).should.be.rejectedWith('Forbidden')
  })

  it('must fail if an invalid key is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.rewardTokenToDeposit)
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      key: key.toBytes32('')
    }).should.be.rejectedWith('Invalid key')
  })

  it('must fail if an invalid name is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      key: key.toBytes32('foobar'),
      name: ''
    }).should.be.rejectedWith('Invalid name')
  })

  it('must fail if an invalid staking token is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      key: key.toBytes32('foobar'),
      stakingToken: helper.zerox
    }).should.be.rejectedWith('Invalid staking token')
  })

  it('must fail if an invalid reward token is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      key: key.toBytes32('foobar'),
      rewardToken: helper.zerox
    }).should.be.rejectedWith('Invalid reward token')
  })

  it('must fail if an invalid reward token stablecoin pair is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      key: key.toBytes32('foobar'),
      uniRewardTokenDollarPair: helper.zerox
    }).should.be.rejectedWith('Invalid reward token pair')
  })

  it('must fail if an invalid reward per block is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      key: key.toBytes32('foobar'),
      rewardPerBlock: '0'
    }).should.be.rejectedWith('Provide reward per block')
  })

  it('must fail if an invalid staking target is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.rewardTokenToDeposit)
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      key: key.toBytes32('foobar'),
      stakingTarget: '0'
    }).should.be.rejectedWith('Please provide staking target')
  })

  it('must fail if an invalid lockup period is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.rewardTokenToDeposit)
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      key: key.toBytes32('foobar'),
      lockupPeriod: '0'
    }).should.be.rejectedWith('Provide lockup period in blocks')
  })

  it('must fail if there is no allocation of the reward token', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.rewardTokenToDeposit)
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, bob.address)

    await pool.connect(bob).addOrEditPool({
      ...payload,
      key: key.toBytes32('foobar'),
      rewardTokenToDeposit: '0'
    }).should.be.rejectedWith('Provide reward token allocation')
  })
})
