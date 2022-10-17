const storeComposer = require('./store')
const fakeTokenComposer = require('./token')
const fakeUniswapPairComposer = require('./uniswap-pair')
const libsComposer = require('./libs')
const { deployer, key, sample, helper, intermediate, fileCache } = require('..')
const { getNetworkInfo } = require('../network')
const { grantRoles } = require('./grant-roles')
const { getExternalProtocols } = require('./external-protocols')
const { setStakingPools } = require('./testnet/staking-pools')

/**
 * Initializes all contracts
 * @return {Promise<Contracts>}
 */
const initialize = async (suite, deploymentId) => {
  const [owner] = await ethers.getSigners()
  const startBalance = await ethers.provider.getBalance(owner.address)

  const cache = suite ? null : await fileCache.from(deploymentId)
  const network = await getNetworkInfo()
  const claimPeriod = network.cover.claimPeriod
  const cooldownPeriod = network.cover.cooldownPeriod
  const stateUpdateInterval = network.cover.stateUpdateInterval
  const bondPeriod = network.pool.bond.period.toString()
  const { mainnet } = network

  const tokens = await fakeTokenComposer.compose(cache)
  const { npm, dai, crpool, hwt, obk, sabre, bec, xd, aToken, cDai, tokenInfo } = tokens

  console.info('Deployer: %s / ETH: %s / NPM: %s / DAI: %s', owner.address, helper.weiAsToken(startBalance, 'ETH'), helper.weiAsToken(await npm.balanceOf(owner.address), 'NPM'), helper.weiAsToken(await dai.balanceOf(owner.address), 'DAI'))
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

  await intermediate(cache, store, 'setBool', key.qualifyMember(protocol.address), true)

  await intermediate(cache, protocol, 'initialize', {
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
  })

  const bondPoolContract = await deployer.deployWithLibraries(cache, 'BondPool', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BondPoolLibV1: libs.bondPoolLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    PriceLibV1: libs.priceLibV1.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  const stakingPoolContract = await deployer.deployWithLibraries(cache, 'StakingPools', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    StakingPoolCoreLibV1: libs.stakingPoolCoreLibV1.address,
    StakingPoolLibV1: libs.stakingPoolLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

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

  const policyAdminContract = await deployer.deployWithLibraries(cache, 'PolicyAdmin', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    PolicyHelperV1: libs.policyHelperV1.address,
    RoutineInvokerLibV1: libs.routineInvokerLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  const policy = await deployer.deployWithLibraries(cache, 'Policy', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    CoverUtilV1: libs.coverUtilV1.address,
    PolicyHelperV1: libs.policyHelperV1.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    StrategyLibV1: libs.strategyLibV1.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

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

  const liquidityEngine = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
    AccessControlLibV1: libs.accessControlLibV1.address,
    BaseLibV1: libs.baseLibV1.address,
    NTransferUtilV2: libs.transferLib.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    RegistryLibV1: libs.registryLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    StrategyLibV1: libs.strategyLibV1.address,
    ValidationLibV1: libs.validationLibV1.address
  }, store.address)

  await grantRoles(intermediate, cache, { protocol, cover, policy })

  const addContractArgs = {
    namespaces: [key.PROTOCOL.CNS.BOND_POOL, key.PROTOCOL.CNS.STAKING_POOL, key.PROTOCOL.CNS.COVER_STAKE, key.PROTOCOL.CNS.COVER_REASSURANCE, key.PROTOCOL.CNS.COVER_VAULT_FACTORY, key.PROTOCOL.CNS.COVER_VAULT_DELEGATE, key.PROTOCOL.CNS.COVER_CXTOKEN_FACTORY, key.PROTOCOL.CNS.GOVERNANCE, key.PROTOCOL.CNS.GOVERNANCE_RESOLUTION, key.PROTOCOL.CNS.COVER, key.PROTOCOL.CNS.COVER_POLICY_ADMIN, key.PROTOCOL.CNS.COVER_POLICY, key.PROTOCOL.CNS.CLAIM_PROCESSOR, key.PROTOCOL.CNS.LIQUIDITY_ENGINE],
    contractAddresses: [bondPoolContract, stakingPoolContract, stakingContract, reassuranceContract, vaultFactory, vaultDelegate, cxTokenFactory, governance, resolution, cover, policyAdminContract, policy, claimsProcessor, liquidityEngine]
  }

  const strategies = []

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

    addContractArgs.namespaces.push(key.PROTOCOL.CNS.STRATEGY_AAVE)
    addContractArgs.contractAddresses.push(aaveStrategy)

    strategies.push(aaveStrategy.address)
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

    addContractArgs.namespaces.push(key.PROTOCOL.CNS.STRATEGY_COMPOUND)
    addContractArgs.contractAddresses.push(compoundStrategy)

    strategies.push(compoundStrategy.address)
  }

  await intermediate(cache, protocol, 'addContracts', addContractArgs.namespaces, Array(addContractArgs.namespaces.length).fill(helper.emptyBytes32), addContractArgs.contractAddresses.map(x => x.address))

  if (strategies.length) {
    await intermediate(cache, liquidityEngine, 'addStrategies', strategies)
  }

  await intermediate(cache, npm, 'approve', bondPoolContract.address, helper.ether(2_000_000))

  await intermediate(cache, bondPoolContract, 'setup', {
    lpToken: npmUsdPair.address,
    treasury: sample.fake.TREASURY,
    bondDiscountRate: helper.percentage(0.75),
    maxBondAmount: helper.ether(10_000),
    vestingTerm: bondPeriod,
    npmToTopUpNow: helper.ether(2_000_000)
  })

  await intermediate(cache, liquidityEngine, 'setRiskPoolingPeriods', key.toBytes32(''), network.cover.lendingPeriod, network.cover.withdrawalWindow)

  await intermediate(cache, cover, 'updateCoverCreatorWhitelist', [owner.address], [true])
  await intermediate(cache, cover, 'initialize', dai.address, key.toBytes32('DAI'))

  await intermediate(cache, policyAdminContract, 'setPolicyRatesByKey', key.toBytes32(''), helper.percentage(7), helper.percentage(45))

  const returns = {
    startBalance,
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

  if (mainnet === false) {
    await setStakingPools(cache, returns)
  }

  return returns
}

module.exports = { initialize }
