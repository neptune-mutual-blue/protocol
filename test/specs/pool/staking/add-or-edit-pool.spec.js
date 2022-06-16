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
  let pool, payload, deployed, dai, npmDai, sabre, sabreDai

  before(async () => {
    deployed = await deployDependencies()

    const [owner] = await ethers.getSigners()
    dai = await deployer.deploy(cache, 'FakeToken', 'DAI', 'DAI', helper.ether(100_000_000, PRECISION), PRECISION)
    ;[[npmDai]] = await pair.deploySeveral(cache, [{ token0: deployed.npm, token1: dai }])
    sabre = await deployer.deploy(cache, 'FakeToken', 'Sabre Oracles', 'SABRE', helper.ether(100_000_000), 12)
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
        helper.percentage(0.5), // Platform fee
        (12_345_678).toString(), // Reward per block
        minutesToBlocks(31337, 5), // 5 minutes lockup period
        helper.ether(10_000_000) // Deposit 10M sabre tokens
      ]
    }
  })

  it('must correctly add a new pool', async () => {
    const [owner, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.values[5])
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    const tx = await pool.connect(bob).addOrEditPool(payload.key, payload.name, payload.poolType, payload.addresses, payload.values)
    await deployed.protocol.revokeRole(key.ACCESS_CONTROL.ADMIN, bob.address)

    const { events } = await tx.wait()
    const event = events.pop()

    event.args.key.should.equal(payload.key)
    event.args.name.should.equal(payload.name)
    event.args.poolType.should.equal(payload.poolType)
    event.args.stakingToken.should.equal(deployed.npm.address)
    event.args.uniStakingTokenDollarPair.should.equal(npmDai.address)
    event.args.rewardToken.should.equal(sabre.address)
    event.args.uniRewardTokenDollarPair.should.equal(sabreDai.address)
    event.args.rewardTokenDeposit.should.equal(payload.values[payload.values.length - 1])
    event.args.maxStake.should.equal(payload.values[1])
    event.args.platformFee.should.equal(payload.values[2])
    event.args.rewardPerBlock.should.equal(payload.values[3])
    event.args.lockupPeriodInBlocks.should.equal(payload.values[4])

    const info = await pool.getInfo(payload.key, owner.address)

    const [
      name,
      [stakingToken, stakingTokenStablecoinPair, rewardToken, rewardTokenStablecoinPair],
      [totalStaked, target, maximumStake, stakeBalance, cumulativeDeposits, rewardPerBlock, platformFee, lockupPeriod, rewardTokenBalance, accountStakeBalance]
    ] = info

    name.should.equal(payload.name)
    stakingToken.should.equal(deployed.npm.address)
    stakingTokenStablecoinPair.should.equal(npmDai.address)
    rewardToken.should.equal(sabre.address)
    rewardTokenStablecoinPair.should.equal(sabreDai.address)
    totalStaked.should.equal('0')
    target.should.equal(payload.values[0])
    maximumStake.should.equal(payload.values[1])
    stakeBalance.should.equal('0')
    cumulativeDeposits.should.equal('0')
    rewardPerBlock.should.equal(payload.values[3])
    platformFee.should.equal(payload.values[2])
    lockupPeriod.should.equal(payload.values[4])
    rewardTokenBalance.should.equal(payload.values[5])
    accountStakeBalance.should.equal('0')
  })

  it('must correct edit an existing pool', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.values[5])
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    const values = ['0', '0', '0', '0', '0', '0']

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(payload.key, '', payload.poolType, payload.addresses, values)

    const info = await pool.getInfo(payload.key, bob.address)

    const [
      name,
      [stakingToken, stakingTokenStablecoinPair, rewardToken, rewardTokenStablecoinPair],
      [totalStaked, target, maximumStake, stakeBalance, cumulativeDeposits, rewardPerBlock, platformFee, lockupPeriod, rewardTokenBalance, accountStakeBalance]
    ] = info

    name.should.equal(payload.name)
    stakingToken.should.equal(deployed.npm.address)
    stakingTokenStablecoinPair.should.equal(npmDai.address)
    rewardToken.should.equal(sabre.address)
    rewardTokenStablecoinPair.should.equal(sabreDai.address)
    totalStaked.should.equal('0')
    target.should.equal(payload.values[0])
    maximumStake.should.equal(payload.values[1])
    stakeBalance.should.equal('0')
    cumulativeDeposits.should.equal('0')
    rewardPerBlock.should.equal(payload.values[3])
    platformFee.should.equal(payload.values[2])
    lockupPeriod.should.equal(payload.values[4])
    rewardTokenBalance.should.equal(payload.values[5])
    accountStakeBalance.should.equal('0')
  })

  it('must fail if the protocol is paused', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.PAUSE_AGENT, bob.address)
    await deployed.protocol.connect(bob).pause()
    await deployed.protocol.revokeRole(key.ACCESS_CONTROL.PAUSE_AGENT, bob.address)

    await sabre.transfer(bob.address, payload.values[4])

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)
    await deployed.protocol.revokeRole(key.ACCESS_CONTROL.ADMIN, bob.address)

    await pool.connect(bob).addOrEditPool(payload.key, payload.name, payload.poolType, payload.addresses, payload.values)
      .should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UNPAUSE_AGENT, bob.address)
    await deployed.protocol.connect(bob).unpause()
    await deployed.protocol.revokeRole(key.ACCESS_CONTROL.UNPAUSE_AGENT, bob.address)
  })

  it('must fail if accessed by a non admin', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.values[4])
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await pool.connect(bob).addOrEditPool(payload.key, payload.name, payload.poolType, payload.addresses, payload.values)
      .should.be.rejectedWith('Forbidden')
  })

  it('must fail if an invalid key is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.values[5])
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(key.toBytes32(''), payload.name, payload.poolType, payload.addresses, payload.values)
      .should.be.rejectedWith('Invalid key')
  })

  it('must fail if an invalid name is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(key.toBytes32('test'), '', payload.poolType, payload.addresses, payload.values)
      .should.be.rejectedWith('Invalid name')
  })

  it('must fail if an invalid staking token is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    const addresses = [...payload.addresses]
    addresses[0] = helper.zerox

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(key.toBytes32('test2'), payload.name, payload.poolType, addresses, payload.values)
      .should.be.rejectedWith('Invalid staking token')
  })

  it('must fail if an invalid reward token is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    const addresses = [...payload.addresses]
    addresses[2] = helper.zerox

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(key.toBytes32('test3'), payload.name, payload.poolType, addresses, payload.values)
      .should.be.rejectedWith('Invalid reward token')
  })

  it('must fail if an invalid reward token stablecoin pair is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    const addresses = [...payload.addresses]
    addresses[3] = helper.zerox

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(key.toBytes32('test4'), payload.name, payload.poolType, addresses, payload.values)
      .should.be.rejectedWith('Invalid reward token pair')
  })

  it('must fail if an invalid reward per block is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    const values = [...payload.values]
    values[3] = 0

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(key.toBytes32('test5'), payload.name, payload.poolType, payload.addresses, values)
      .should.be.rejectedWith('Provide reward per block')
  })

  it('must fail if an invalid staking target is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.values[5])
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    const values = [...payload.values]
    values[0] = 0

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(key.toBytes32('test6'), payload.name, payload.poolType, payload.addresses, values)
      .should.be.rejectedWith('Please provide staking target')
  })

  it('must fail if an invalid lockup period is specified', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.values[5])
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    const values = [...payload.values]
    values[4] = 0

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(key.toBytes32('test6'), payload.name, payload.poolType, payload.addresses, values)
      .should.be.rejectedWith('Provide lockup period in blocks')
  })

  it('must fail if there is no allocation of the reward token', async () => {
    const [, bob] = await ethers.getSigners()

    await sabre.transfer(bob.address, payload.values[5])
    await sabre.connect(bob).approve(pool.address, ethers.constants.MaxUint256)

    const values = [...payload.values]
    values[5] = 0

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.ADMIN, bob.address)
    await pool.connect(bob).addOrEditPool(key.toBytes32('test7'), payload.name, payload.poolType, payload.addresses, values)
      .should.be.rejectedWith('Provide reward token allocation')
  })
})
