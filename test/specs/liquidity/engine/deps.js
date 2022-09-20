/* eslint-disable no-unused-expressions */
const { helper, deployer, key } = require('../../../../util')
const DAYS = 86400
const cache = null

const deployDependencies = async () => {
  const [owner] = await ethers.getSigners()
  const store = await deployer.deploy(cache, 'Store')
  const router = await deployer.deploy(cache, 'FakeUniswapV2RouterLike')

  const npm = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(100_000_000), 18)
  const storeKeyUtil = await deployer.deploy(cache, 'StoreKeyUtil')

  const protoUtilV1 = await deployer.deployWithLibraries(cache, 'ProtoUtilV1', {
    StoreKeyUtil: storeKeyUtil.address
  })

  const accessControlLibV1 = await deployer.deployWithLibraries(cache, 'AccessControlLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const registryLibV1 = await deployer.deployWithLibraries(cache, 'RegistryLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const strategyLibV1 = await deployer.deployWithLibraries(cache, 'StrategyLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const coverUtilV1 = await deployer.deployWithLibraries(cache, 'CoverUtilV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    StrategyLibV1: strategyLibV1.address
  })

  const priceLibV1 = await deployer.deployWithLibraries(cache, 'PriceLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const routineInvokerLibV1 = await deployer.deployWithLibraries(cache, 'RoutineInvokerLibV1', {
    CoverUtilV1: coverUtilV1.address,
    PriceLibV1: priceLibV1.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StrategyLibV1: strategyLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const governanceUtilV1 = await deployer.deployWithLibraries(cache, 'GovernanceUtilV1', {
    CoverUtilV1: coverUtilV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const validationLibV1 = await deployer.deployWithLibraries(cache, 'ValidationLibV1', {
    AccessControlLibV1: accessControlLibV1.address,
    CoverUtilV1: coverUtilV1.address,
    GovernanceUtilV1: governanceUtilV1.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const transferLib = await deployer.deploy(cache, 'NTransferUtilV2')

  const stakingPoolCoreLibV1 = await deployer.deployWithLibraries(cache, 'StakingPoolCoreLibV1', {
    NTransferUtilV2: transferLib.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const stakingPoolLibV1 = await deployer.deployWithLibraries(cache, 'StakingPoolLibV1', {
    NTransferUtilV2: transferLib.address,
    ProtoUtilV1: protoUtilV1.address,
    StakingPoolCoreLibV1: stakingPoolCoreLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const baseLibV1 = await deployer.deployWithLibraries(cache, 'BaseLibV1', {
  })

  const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
    {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    },
    store.address
  )

  await store.setBool(key.qualify(protocol.address), true)
  await store.setBool(key.qualifyMember(protocol.address), true)

  const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

  const args = {
    burner: helper.zero1,
    uniswapV2RouterLike: router.address,
    uniswapV2FactoryLike: helper.randomAddress(),
    npm: npm.address,
    treasury: helper.randomAddress(),
    priceOracle: priceOracle.address,
    coverCreationFee: helper.ether(0),
    minCoverCreationStake: helper.ether(0),
    firstReportingStake: helper.ether(250),
    claimPeriod: 7 * DAYS,
    reportingBurnRate: helper.percentage(30),
    governanceReporterCommission: helper.percentage(10),
    claimPlatformFee: helper.percentage(6.5),
    claimReporterCommission: helper.percentage(5),
    flashLoanFee: helper.percentage(0.5),
    flashLoanFeeProtocol: helper.percentage(2.5),
    resolutionCoolDownPeriod: 1 * DAYS,
    stateUpdateInterval: 1 * DAYS,
    maxLendingRatio: helper.percentage(5)
  }

  await protocol.initialize(args)

  await protocol.grantRoles([
    {
      account: protocol.address,
      roles: [
        key.ACCESS_CONTROL.LIQUIDITY_MANAGER,
        key.ACCESS_CONTROL.UPGRADE_AGENT
      ]
    },
    {
      account: owner.address,
      roles: [
        key.ACCESS_CONTROL.LIQUIDITY_MANAGER,
        key.ACCESS_CONTROL.PAUSE_AGENT,
        key.ACCESS_CONTROL.UNPAUSE_AGENT,
        key.ACCESS_CONTROL.UPGRADE_AGENT
      ]
    }
  ])

  return {
    npm,
    store,
    router,
    storeKeyUtil,
    protoUtilV1,
    accessControlLibV1,
    registryLibV1,
    coverUtilV1,
    governanceUtilV1,
    validationLibV1,
    baseLibV1,
    stakingPoolCoreLibV1,
    stakingPoolLibV1,
    transferLib,
    strategyLibV1,
    protocol
  }
}

module.exports = { deployDependencies }
