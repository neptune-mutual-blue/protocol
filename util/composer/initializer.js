const hre = require('hardhat')
const storeComposer = require('./store')
const fakeTokenComposer = require('./token')
const fakeUniswapPairComposer = require('./uniswap-pair')
const libsComposer = require('./libs')
const { deployer, key, sample, helper, intermediate, fileCache } = require('..')
const { getNetworkInfo } = require('../network')
const { grantRoles } = require('./grant-roles')
const { minutesToBlocks } = require('../block-time')
const { getExternalProtocols } = require('./external-protocols')

/**
 * Initializes all contracts
 * @return {Promise<Contracts>}
 */
const initialize = async (suite, deploymentId) => {
  const chainId = hre.network.config.chainId
  const [owner] = await ethers.getSigners()

  const cache = suite ? null : await fileCache.from(deploymentId)
  const network = await getNetworkInfo()
  const claimPeriod = network.cover.claimPeriod
  const cooldownPeriod = network.cover.cooldownPeriod
  const stateUpdateInterval = network.cover.stateUpdateInterval
  const bondPeriod = network.pool.bond.period.toString()

  const tokens = await fakeTokenComposer.compose(cache)
  const { npm, dai, crpool, hwt, obk, sabre, bec, xd, aToken, cDai, tokenInfo } = tokens

  console.info('[Deployer: %s]. [NPM: %s]. [DAI: %s]', owner.address, await npm.balanceOf(owner.address), await dai.balanceOf(owner.address))

  const { router, factory, aaveLendingPool, compoundDaiDelegator, npmPriceOracle } = await getExternalProtocols(cache, tokens)

  const [pairs, pairInfo] = await fakeUniswapPairComposer.compose(cache, tokens)

  const [npmUsdPair, crpoolUsdPair, hwtUsdPair, obkUsdPair, sabreUsdPair, becUsdPair, xdUsdPair] = pairs

  // The protocol only supports stablecoin as reassurance token for now
  const reassuranceToken = dai

  const store = await storeComposer.deploy(cache)
  const libs = await libsComposer.deployAll(cache)

  const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
    {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      RegistryLibV1: libs.registryLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLibV1.address
    },
    store.address
  )

  await intermediate(cache, store, 'setBool', key.qualify(protocol.address), true)
  await intermediate(cache, store, 'setBool', key.qualifyMember(protocol.address), true)

  const args = {
    burner: helper.zero1,
    uniswapV2RouterLike: router,
    uniswapV2FactoryLike: factory,
    npm: npm.address,
    treasury: sample.fake.TREASURY,
    priceOracle: npmPriceOracle,
    coverCreationFee: helper.ether(0),
    minCoverCreationStake: helper.ether(0),
    firstReportingStake: helper.ether(250),
    claimPeriod,
    reportingBurnRate: helper.percentage(30),
    governanceReporterCommission: helper.percentage(10),
    claimPlatformFee: helper.percentage(6.5),
    claimReporterCommission: helper.percentage(5),
    flashLoanFee: helper.percentage(0.5),
    flashLoanFeeProtocol: helper.percentage(2.5),
    resolutionCoolDownPeriod: cooldownPeriod,
    stateUpdateInterval: stateUpdateInterval,
    maxLendingRatio: helper.percentage(5)
  }

  await intermediate(cache, protocol, 'initialize', args)

  await grantRoles(intermediate, cache, protocol)
  await intermediate(cache, protocol, 'grantRole', key.ACCESS_CONTROL.UPGRADE_AGENT, protocol.address)

  const bondPoolContract = await deployer.deployWithLibraries(cache, 'BondPool', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BondPoolLibV1: libs.bondPoolLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    PriceLibV1: libs.priceLibV1.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.BOND_POOL, bondPoolContract.address)

  await intermediate(cache, npm, 'approve', bondPoolContract.address, helper.ether(2_000_000))

  await intermediate(cache, bondPoolContract, 'setup', {
    lpToken: npmUsdPair.address,
    treasury: sample.fake.TREASURY,
    bondDiscountRate: helper.percentage(0.75),
    maxBondAmount: helper.ether(10_000),
    vestingTerm: bondPeriod,
    npmToTopUpNow: helper.ether(2_000_000)
  })

  const stakingPoolContract = await deployer.deployWithLibraries(cache, 'StakingPools', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    StakingPoolCoreLibV1: libs.stakingPoolCoreLibV1.address,
    StakingPoolLibV1: libs.stakingPoolLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.STAKING_POOL, stakingPoolContract.address)

  // @todo: only applicable to testnet
  await intermediate(cache, crpool, 'approve', stakingPoolContract.address, helper.ether(22_094_995_300))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('Crpool'),
    name: 'Crystalpool Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: crpool.address,
    uniRewardTokenDollarPair: crpoolUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(10_000),
    platformFee: helper.percentage(0.5),
    rewardPerBlock: (22_094_995_300).toString(),
    lockupPeriod: minutesToBlocks(chainId, 5),
    rewardTokenToDeposit: helper.ether(13_400_300)
  })

  await intermediate(cache, hwt, 'approve', stakingPoolContract.address, helper.ether(13_522_000_000))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('Huobi'),
    name: 'Huobi Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: hwt.address,
    uniRewardTokenDollarPair: hwtUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(10_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (13_522_000_000).toString(),
    lockupPeriod: minutesToBlocks(chainId, 120),
    rewardTokenToDeposit: helper.ether(25_303_000)
  })

  await intermediate(cache, obk, 'approve', stakingPoolContract.address, helper.ether(14_505_290_000))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('OBK'),
    name: 'OBK Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: obk.address,
    uniRewardTokenDollarPair: obkUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(10_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (14_505_290_000).toString(),
    lockupPeriod: minutesToBlocks(chainId, 60),
    rewardTokenToDeposit: helper.ether(16_30_330)
  })

  await intermediate(cache, sabre, 'approve', stakingPoolContract.address, helper.ether(30_330_000_010))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('SABRE'),
    name: 'SABRE Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: sabre.address,
    uniRewardTokenDollarPair: sabreUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(100_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (30_330_000_010).toString(),
    lockupPeriod: minutesToBlocks(chainId, 180),
    rewardTokenToDeposit: helper.ether(42_000_000)
  })

  await intermediate(cache, bec, 'approve', stakingPoolContract.address, helper.ether(8_940_330_000))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('BEC'),
    name: 'BEC Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: bec.address,
    uniRewardTokenDollarPair: becUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(100_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (8_940_330_000).toString(),
    lockupPeriod: minutesToBlocks(chainId, 60 * 48),
    rewardTokenToDeposit: helper.ether(27_000_000)
  })

  await intermediate(cache, xd, 'approve', stakingPoolContract.address, helper.ether(18_559_222_222))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('XD'),
    name: 'XD Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: xd.address,
    uniRewardTokenDollarPair: xdUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(100_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (18_559_222_222).toString(),
    lockupPeriod: minutesToBlocks(chainId, 90),
    rewardTokenToDeposit: helper.ether(19_000_000)
  })

  const stakingContract = await deployer.deployWithLibraries(cache, 'CoverStake', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    CoverUtilV1: libs.coverUtilV1.address,
    RoutineInvokerLibV1: libs.routineInvokerLibV1.address,
    NTransferUtilV2: libs.transferLib.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.COVER_STAKE, stakingContract.address)

  const reassuranceContract = await deployer.deployWithLibraries(cache, 'CoverReassurance', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    CoverUtilV1: libs.coverUtilV1.address,
    GovernanceUtilV1: libs.governanceUtilV1.address,
    RoutineInvokerLibV1: libs.routineInvokerLibV1.address,
    NTransferUtilV2: libs.transferLib.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    RegistryLibV1: libs.registryLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.COVER_REASSURANCE, reassuranceContract.address)

  const vaultFactory = await deployer.deployWithLibraries(cache, 'VaultFactory',
    {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      ValidationLibV1: libs.validationLibV1.address,
      VaultFactoryLibV1: libs.vaultFactoryLib.address
    }
    , store.address
  )

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.COVER_VAULT_FACTORY, vaultFactory.address)

  const vaultDelegate = await deployer.deployWithLibraries(cache, 'VaultDelegate',
    {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      GovernanceUtilV1: libs.governanceUtilV1.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      RoutineInvokerLibV1: libs.routineInvokerLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      StrategyLibV1: libs.strategyLibV1.address,
      ValidationLibV1: libs.validationLibV1.address,
      VaultLibV1: libs.vaultLib.address
    }
    , store.address
  )

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.COVER_VAULT_DELEGATE, vaultDelegate.address)

  const cxTokenFactory = await deployer.deployWithLibraries(cache, 'cxTokenFactory',
    {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      cxTokenFactoryLibV1: libs.cxTokenFactoryLib.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLibV1.address
    }
    , store.address
  )

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.COVER_CXTOKEN_FACTORY, cxTokenFactory.address)

  const governance = await deployer.deployWithLibraries(cache, 'Governance',
    {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      CoverUtilV1: libs.coverUtilV1.address,
      GovernanceUtilV1: libs.governanceUtilV1.address,
      NTransferUtilV2: libs.transferLib.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      RegistryLibV1: libs.registryLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLibV1.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.GOVERNANCE, governance.address)

  const resolution = await deployer.deployWithLibraries(cache, 'Resolution',
    {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      RoutineInvokerLibV1: libs.routineInvokerLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      CoverUtilV1: libs.coverUtilV1.address,
      NTransferUtilV2: libs.transferLib.address,
      ValidationLibV1: libs.validationLibV1.address,
      GovernanceUtilV1: libs.governanceUtilV1.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.GOVERNANCE_RESOLUTION, resolution.address)

  const cover = await deployer.deployWithLibraries(cache, 'Cover',
    {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      CoverLibV1: libs.coverLibV1.address,
      CoverUtilV1: libs.coverUtilV1.address,
      RoutineInvokerLibV1: libs.routineInvokerLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLibV1.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.COVER, cover.address)

  const policyAdminContract = await deployer.deployWithLibraries(cache, 'PolicyAdmin', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    PolicyHelperV1: libs.policyHelperV1.address,
    RoutineInvokerLibV1: libs.routineInvokerLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.COVER_POLICY_ADMIN, policyAdminContract.address)

  const policy = await deployer.deployWithLibraries(cache, 'Policy', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    CoverUtilV1: libs.coverUtilV1.address,
    PolicyHelperV1: libs.policyHelperV1.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    StrategyLibV1: libs.strategyLibV1.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.COVER_POLICY, policy.address)

  const claimsProcessor = await deployer.deployWithLibraries(cache, 'Processor',
    {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      CoverUtilV1: libs.coverUtilV1.address,
      GovernanceUtilV1: libs.governanceUtilV1.address,
      RoutineInvokerLibV1: libs.routineInvokerLibV1.address,
      NTransferUtilV2: libs.transferLib.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      RegistryLibV1: libs.registryLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLibV1.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.CLAIM_PROCESSOR, claimsProcessor.address)

  const liquidityEngine = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    StrategyLibV1: libs.strategyLibV1.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.LIQUIDITY_ENGINE, liquidityEngine.address)

  await intermediate(cache, liquidityEngine, 'setRiskPoolingPeriods', key.toBytes32(''), network.cover.lendingPeriod, network.cover.withdrawalWindow)

  if (aaveLendingPool) {
    const aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      NTransferUtilV2: libs.transferLib.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      RegistryLibV1: libs.registryLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLibV1.address
    }, store.address, aaveLendingPool, aToken.address)

    await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.STRATEGY_AAVE, aaveStrategy.address)
    await intermediate(cache, liquidityEngine, 'addStrategies', [aaveStrategy.address])
  }

  if (compoundDaiDelegator) {
    const compoundStrategy = await deployer.deployWithLibraries(cache, 'CompoundStrategy', {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      NTransferUtilV2: libs.transferLib.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      RegistryLibV1: libs.registryLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLibV1.address
    }, store.address, compoundDaiDelegator, cDai.address)

    await intermediate(cache, protocol, 'addContract', key.PROTOCOL.CNS.STRATEGY_COMPOUND, compoundStrategy.address)
    await intermediate(cache, liquidityEngine, 'addStrategies', [compoundStrategy.address])
  }

  const payload = [{
    account: cover.address,
    roles: [key.ACCESS_CONTROL.UPGRADE_AGENT]
  },
  {
    account: policy.address,
    roles: [key.ACCESS_CONTROL.UPGRADE_AGENT]
  },
  {
    account: owner.address,
    roles: [key.ACCESS_CONTROL.COVER_MANAGER, key.ACCESS_CONTROL.GOVERNANCE_AGENT, key.ACCESS_CONTROL.LIQUIDITY_MANAGER]
  }]

  await intermediate(cache, protocol, 'grantRoles', payload)

  await intermediate(cache, cover, 'updateCoverCreatorWhitelist', owner.address, true)
  await intermediate(cache, cover, 'initialize', dai.address, key.toBytes32('DAI'))

  await intermediate(cache, policyAdminContract, 'setPolicyRatesByKey', key.toBytes32(''), helper.percentage(7), helper.percentage(45))

  return {
    intermediate,
    cache,
    store,
    npm,
    dai,
    crpool,
    hwt,
    obk,
    sabre,
    bec,
    xd,
    npmUsdPair,
    crpoolUsdPair,
    hwtUsdPair,
    obkUsdPair,
    sabreUsdPair,
    becUsdPair,
    xdUsdPair,
    reassuranceToken,
    protocol,
    stakingContract,
    reassuranceContract,
    vaultFactory,
    cxTokenFactory,
    cover,
    liquidityEngine,
    policyAdminContract,
    policy,
    governance,
    resolution,
    claimsProcessor,
    bondPoolContract,
    stakingPoolContract,
    libs,
    tokenInfo,
    pairInfo
  }
}

module.exports = { initialize }
