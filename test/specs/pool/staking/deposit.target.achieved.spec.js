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

describe('Deposit to Staking Pool (Target Achieved)', () => {
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
      maxStake: helper.ether(400_000_000),
      platformFee: helper.percentage(0.5),
      rewardPerBlock: (12_345_678).toString(),
      lockupPeriod: minutesToBlocks(31337, 5),
      rewardTokenToDeposit: helper.ether(10_000_000)
    }

    await sabre.approve(pool.address, ethers.constants.MaxUint256)
    await pool.addOrEditPool(payload)
  })

  it('must allow depositing up to the target', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.npm.transfer(bob.address, helper.ether(50_000_000))
    const amount = payload.stakingTarget

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(payload.key, amount)
  })

  it('must revert if cap is exceeded', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.npm.transfer(bob.address, helper.ether(50_000_000))
    const amount = helper.ether(1)

    await deployed.npm.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).deposit(payload.key, amount)
      .should.be.rejectedWith('Target achieved or cap exceeded')
  })
})
