const storeComposer = require('./store')
const fakeTokenComposer = require('./token')
const fakeUniswapPairComposer = require('./uniswap-pair')
const libsComposer = require('./libs')
const { deployer, key, sample, helper, intermediate, fileCache } = require('..')
const { getNetworkInfo } = require('../network')
const { grantRoles } = require('./grant-roles')
const { getExternalProtocols } = require('./external-protocols')
const { setStakingPools } = require('./testnet/staking-pools')
const chalk = require('chalk')

/**
 * Initializes all contracts
 * @return {Promise<Contracts>}
 */
const initialize = async (suite, deploymentId) => {
  const [owner] = await ethers.getSigners()
  const startBalance = await ethers.provider.getBalance(owner.address)

  const cache = suite ? null : await fileCache.from(deploymentId)
  const network = await getNetworkInfo()

  if (network.chainId !== 31337) {
    console.info(chalk.red.bold.underline('Deploying to %s: %s (%s)\n'), network.mainnet ? 'mainnet' : 'testnet', network.network, network.chainId)
  }

  const claimPeriod = network.cover.claimPeriod
  const cooldownPeriod = network.cover.cooldownPeriod
  const stateUpdateInterval = network.cover.stateUpdateInterval
  const bondPeriod = network.pool.bond.period.toString()
  const { mainnet } = network
  const burner = network.protocol.burner
  const treasury = network.protocol.treasury

  const tokens = await fakeTokenComposer.compose(cache)

  console.info('Deployer: %s / ETH: %s / NPM: %s / USDC: %s', owner.address, helper.weiAsToken(startBalance, 'ETH'), helper.weiAsToken(await tokens.npm.balanceOf(owner.address), 'NPM'), helper.weiAsToken(await tokens.stablecoin.balanceOf(owner.address), 'USDC'))

  const { router, factory, aaveLendingPool, compoundStablecoinDelegator, priceOracle } = await getExternalProtocols(cache, tokens)

  const [pairs, pairInfo] = await fakeUniswapPairComposer.compose(cache, tokens)

  const [npmUsdPair, crpoolUsdPair, hwtUsdPair, obkUsdPair, sabreUsdPair, becUsdPair, xdUsdPair] = pairs

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

  const args = {
    burner,
    uniswapV2RouterLike: router,
    uniswapV2FactoryLike: factory,
    npm: tokens.npm.address,
    treasury,
    priceOracle,
    coverCreationFee: helper.ether(10_000),
    minCoverCreationStake: helper.ether(0),
    minStakeToAddLiquidity: helper.ether(0),
    firstReportingStake: helper.ether(10_000),
    claimPeriod,
    reportingBurnRate: helper.percentage(30),
    governanceReporterCommission: helper.percentage(10),
    claimPlatformFee: helper.percentage(6.5),
    claimReporterCommission: helper.percentage(5),
    flashLoanFee: helper.percentage(0.5),
    flashLoanFeeProtocol: helper.percentage(6.5),
    resolutionCoolDownPeriod: cooldownPeriod,
    stateUpdateInterval: stateUpdateInterval,
    maxLendingRatio: helper.percentage(5),
    lendingPeriod: network.cover.lendingPeriod,
    withdrawalWindow: network.cover.withdrawalWindow,
    policyFloor: helper.percentage(1),
    policyCeiling: helper.percentage(89)
  }

  await intermediate(cache, protocol, 'initialize', args)

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

  if (aaveLendingPool && mainnet === false) {
    const aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      NTransferUtilV2: libs.transferLib.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      RegistryLibV1: libs.registryLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLibV1.address
    }, store.address, aaveLendingPool, tokens.aToken.address)

    addContractArgs.namespaces.push(key.PROTOCOL.CNS.STRATEGY_AAVE)
    addContractArgs.contractAddresses.push(aaveStrategy)

    strategies.push(aaveStrategy.address)
  }

  if (compoundStablecoinDelegator && mainnet === false) {
    const compoundStrategy = await deployer.deployWithLibraries(cache, 'CompoundStrategy', {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      NTransferUtilV2: libs.transferLib.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      RegistryLibV1: libs.registryLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLibV1.address
    }, store.address, compoundStablecoinDelegator, tokens.cStablecoin.address)

    addContractArgs.namespaces.push(key.PROTOCOL.CNS.STRATEGY_COMPOUND)
    addContractArgs.contractAddresses.push(compoundStrategy)

    strategies.push(compoundStrategy.address)
  }

  await intermediate(cache, protocol, 'addContracts', addContractArgs.namespaces, Array(addContractArgs.namespaces.length).fill(helper.emptyBytes32), addContractArgs.contractAddresses.map(x => x.address))

  if (strategies.length) {
    await intermediate(cache, liquidityEngine, 'addStrategies', strategies)
  }

  if (mainnet === false) {
    await intermediate(cache, tokens.npm, 'approve', bondPoolContract.address, helper.ether(2_000_000))

    await intermediate(cache, bondPoolContract, 'setup', {
      lpToken: npmUsdPair.address,
      treasury: sample.fake.TREASURY,
      bondDiscountRate: helper.percentage(0.75),
      maxBondAmount: helper.ether(10_000),
      vestingTerm: bondPeriod,
      npmToTopUpNow: helper.ether(2_000_000)
    })
  }

  await intermediate(cache, cover, 'initialize', tokens.stablecoin.address, key.toBytes32('USDC'))

  const returns = {
    startBalance,
    intermediate,
    cache,
    store,
    tokens,
    pairs,
    pairInfo,
    npmUsdPair,
    crpoolUsdPair,
    hwtUsdPair,
    obkUsdPair,
    sabreUsdPair,
    becUsdPair,
    xdUsdPair,
    reassuranceToken: tokens.stablecoin,
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
    libs
  }

  if (mainnet === false) {
    await setStakingPools(cache, returns)
  }

  return returns
}

module.exports = { initialize }
