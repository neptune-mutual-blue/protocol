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

describe('Close Pool', () => {
  let pool, payload, deployed, stablecoin, npmStablecoinPair, sabre, sabreStablecoinPair

  before(async () => {
    deployed = await deployDependencies()

    const [owner] = await ethers.getSigners()
    stablecoin = await deployer.deploy(cache, 'FakeToken', 'USDC', 'USDC', helper.ether(100_000_000, PRECISION), PRECISION)
    ;[[npmStablecoinPair]] = await pair.deploySeveral(cache, [{ token0: deployed.npm, token1: stablecoin }])
    sabre = await deployer.deploy(cache, 'FakeToken', 'Sabre Oracles', 'SABRE', helper.ether(100_000_000), 18)
    ;[[sabreStablecoinPair]] = await pair.deploySeveral(cache, [{ token0: sabre, token1: stablecoin }])

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

    await sabre.approve(pool.address, ethers.constants.MaxUint256)
    await pool.addOrEditPool(payload)
  })

  it('must correctly close a pool', async () => {
    const [owner] = await ethers.getSigners()
    const tx = await pool.closePool(payload.key)

    const { events } = await tx.wait()
    const event = events.pop()

    event.args.key.should.equal(payload.key)
    event.args.name.should.equal(payload.name)

    const info = await pool.getInfo(payload.key, owner.address)

    info.name.should.equal('')
    info.stakingToken.should.equal(helper.zerox)
    info.stakingTokenStablecoinPair.should.equal(helper.zerox)
    info.rewardToken.should.equal(helper.zerox)
    info.rewardTokenStablecoinPair.should.equal(helper.zerox)
    info.totalStaked.should.equal('0')
    info.target.should.equal('0')
    info.maximumStake.should.equal('0')
    info.stakeBalance.should.equal('0')
    info.cumulativeDeposits.should.equal('0')
    info.rewardPerBlock.should.equal('0')
    info.platformFee.should.equal('0')
    info.lockupPeriod.should.equal('0')
    info.rewardTokenBalance.should.equal('0')
    info.accountStakeBalance.should.equal('0')
  })

  it('must reject if the protocol is paused', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.PAUSE_AGENT, owner.address)
    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UNPAUSE_AGENT, owner.address)

    await deployed.protocol.pause()
    await pool.closePool(payload.key).should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('must reject if accessed by non admins', async () => {
    const [, bob] = await ethers.getSigners()

    await pool.connect(bob).closePool(payload.key).should.be.rejectedWith('Forbidden')
  })

  it('must reject to delete unknown pools', async () => {
    await pool.closePool(key.toBytes32('test')).should.be.rejectedWith('Unknown Pool')
  })
})
