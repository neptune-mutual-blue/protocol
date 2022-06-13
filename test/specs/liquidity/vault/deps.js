/* eslint-disable no-unused-expressions */
const { helper, deployer, key } = require('../../../../util')
const pair = require('../../../../util/composer/uniswap-pair')
const composer = require('../../../../util/composer')

const SECONDS = 1
const MINUTES = 60 * SECONDS
const HOURS = 60 * MINUTES
const DAYS = 24 * HOURS

const cache = null

const deployDependencies = async () => {
  const [owner] = await ethers.getSigners()
  const store = await deployer.deploy(cache, 'Store')
  const router = await deployer.deploy(cache, 'FakeUniswapV2RouterLike')

  const npm = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(100_000_000))
  const dai = await deployer.deploy(cache, 'FakeToken', 'DAI', 'DAI', helper.ether(100_000_000))
  const [[npmDai]] = await pair.deploySeveral(cache, [{ token0: npm.address, token1: dai.address }])

  const factory = await deployer.deploy(cache, 'FakeUniswapV2FactoryLike', npmDai.address)
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

  const baseLibV1 = await deployer.deployWithLibraries(cache, 'BaseLibV1', {
  })

  const coverLibV1 = await deployer.deployWithLibraries(cache, 'CoverLibV1', {
    AccessControlLibV1: accessControlLibV1.address,
    CoverUtilV1: coverUtilV1.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    StrategyLibV1: strategyLibV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    ValidationLibV1: validationLibV1.address
  })

  const policyHelperV1 = await deployer.deployWithLibraries(cache, 'PolicyHelperV1', {
    CoverUtilV1: coverUtilV1.address,
    NTransferUtilV2: transferLib.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
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

  await protocol.initialize(
    [
      helper.zero1,
      router.address,
      factory.address, // factory
      npm.address,
      helper.randomAddress(),
      priceOracle.address
    ],
    [
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Claim period
      helper.percentage(30), // Governance Burn Rate: 30%
      helper.percentage(10), // Governance Reporter Commission: 10%
      helper.percentage(6.5), // Claim: Platform Fee: 6.5%
      helper.percentage(5), // Claim: Reporter Commission: 5%
      helper.percentage(0.5), // Flash Loan Fee: 0.5%
      helper.percentage(2.5), // Flash Loan Protocol Fee: 2.5%
      1 * DAYS, // cooldown period,
      1 * SECONDS, // state and liquidity update interval
      helper.percentage(5) // maximum lending ratio
    ]
  )

  await protocol.grantRoles([{ account: owner.address, roles: [key.ACCESS_CONTROL.UPGRADE_AGENT, key.ACCESS_CONTROL.COVER_MANAGER, key.ACCESS_CONTROL.LIQUIDITY_MANAGER, key.ACCESS_CONTROL.GOVERNANCE_AGENT, key.ACCESS_CONTROL.PAUSE_AGENT, key.ACCESS_CONTROL.UNPAUSE_AGENT] }])
  await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, protocol.address)

  const cover = await deployer.deployWithLibraries(cache, 'Cover',
    {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      CoverLibV1: coverLibV1.address,
      RoutineInvokerLibV1: routineInvokerLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    },
    store.address
  )

  await protocol.addContract(key.PROTOCOL.CNS.COVER, cover.address)
  await cover.initialize(dai.address, key.toBytes32('DAI'))

  const stakingContract = await deployer.deployWithLibraries(cache, 'CoverStake', {
    AccessControlLibV1: accessControlLibV1.address,
    BaseLibV1: baseLibV1.address,
    CoverUtilV1: coverUtilV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    NTransferUtilV2: transferLib.address,
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    ValidationLibV1: validationLibV1.address
  }, store.address)

  await protocol.addContract(key.PROTOCOL.CNS.COVER_STAKE, stakingContract.address)

  const reassuranceContract = await deployer.deployWithLibraries(cache, 'CoverReassurance', {
    AccessControlLibV1: accessControlLibV1.address,
    BaseLibV1: baseLibV1.address,
    CoverUtilV1: coverUtilV1.address,
    GovernanceUtilV1: governanceUtilV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    NTransferUtilV2: transferLib.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    ValidationLibV1: validationLibV1.address
  }, store.address)

  await protocol.addContract(key.PROTOCOL.CNS.COVER_REASSURANCE, reassuranceContract.address)

  const vaultFactoryLib = await deployer.deployWithLibraries(cache, 'VaultFactoryLibV1', {
    AccessControlLibV1: accessControlLibV1.address,
    BaseLibV1: baseLibV1.address,
    NTransferUtilV2: transferLib.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    ValidationLibV1: validationLibV1.address
  })

  const vaultFactory = await deployer.deployWithLibraries(cache, 'VaultFactory',
    {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      ProtoUtilV1: protoUtilV1.address,
      ValidationLibV1: validationLibV1.address,
      VaultFactoryLibV1: vaultFactoryLib.address
    }
    , store.address
  )

  await protocol.addContract(key.PROTOCOL.CNS.COVER_VAULT_FACTORY, vaultFactory.address)
  await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, cover.address)

  const vaultLib = await deployer.deployWithLibraries(cache, 'VaultLibV1', {
    CoverUtilV1: coverUtilV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    StrategyLibV1: strategyLibV1.address
  })

  const vaultDelegate = await deployer.deployWithLibraries(cache, 'VaultDelegate',
    {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      ProtoUtilV1: protoUtilV1.address,
      RoutineInvokerLibV1: routineInvokerLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      StrategyLibV1: strategyLibV1.address,
      ValidationLibV1: validationLibV1.address,
      VaultLibV1: vaultLib.address
    }
    , store.address
  )

  await protocol.addContract(key.PROTOCOL.CNS.COVER_VAULT_DELEGATE, vaultDelegate.address)

  const cxTokenFactoryLib = await deployer.deployWithLibraries(cache, 'cxTokenFactoryLibV1', {
    AccessControlLibV1: accessControlLibV1.address,
    BaseLibV1: baseLibV1.address,
    GovernanceUtilV1: governanceUtilV1.address,
    PolicyHelperV1: policyHelperV1.address,
    ProtoUtilV1: protoUtilV1.address,
    ValidationLibV1: validationLibV1.address
  })

  const cxTokenFactory = await deployer.deployWithLibraries(cache, 'cxTokenFactory',
    {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      cxTokenFactoryLibV1: cxTokenFactoryLib.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }
    , store.address
  )

  await protocol.addContract(key.PROTOCOL.CNS.COVER_CXTOKEN_FACTORY, cxTokenFactory.address)

  const governance = await deployer.deployWithLibraries(cache, 'Governance',
    {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      CoverUtilV1: coverUtilV1.address,
      GovernanceUtilV1: governanceUtilV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    },
    store.address
  )

  await protocol.addContract(key.PROTOCOL.CNS.GOVERNANCE, governance.address)

  const resolution = await deployer.deployWithLibraries(cache, 'Resolution',
    {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      RoutineInvokerLibV1: routineInvokerLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ProtoUtilV1: protoUtilV1.address,
      CoverUtilV1: coverUtilV1.address,
      NTransferUtilV2: transferLib.address,
      ValidationLibV1: validationLibV1.address,
      GovernanceUtilV1: governanceUtilV1.address
    },
    store.address
  )

  await protocol.addContract(key.PROTOCOL.CNS.GOVERNANCE_RESOLUTION, resolution.address)

  const policy = await deployer.deployWithLibraries(cache, 'Policy', {
    AccessControlLibV1: accessControlLibV1.address,
    BaseLibV1: baseLibV1.address,
    CoverUtilV1: coverUtilV1.address,
    PolicyHelperV1: policyHelperV1.address,
    StrategyLibV1: strategyLibV1.address,
    ValidationLibV1: validationLibV1.address
  }, store.address, '0')

  await protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY, policy.address)

  const coverKey = key.toBytes32('foo-bar')
  const stakeWithFee = helper.ether(10_000)
  const initialReassuranceAmount = helper.ether(1_000_000)
  const initialLiquidity = helper.ether(4_000_000)
  const minReportingStake = helper.ether(250)
  const reportingPeriod = 7 * DAYS
  const cooldownPeriod = 1 * DAYS
  const claimPeriod = 7 * DAYS
  const floor = helper.percentage(7)
  const ceiling = helper.percentage(45)
  const reassuranceRate = helper.percentage(50)
  const leverage = '1'

  const requiresWhitelist = false
  const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]

  const info = key.toBytes32('info')

  cover.updateCoverCreatorWhitelist(owner.address, true)

  await npm.approve(stakingContract.address, stakeWithFee)
  await dai.approve(reassuranceContract.address, initialReassuranceAmount)

  await cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)

  const liquidityEngine = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
    AccessControlLibV1: accessControlLibV1.address,
    BaseLibV1: baseLibV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    StrategyLibV1: strategyLibV1.address,
    ValidationLibV1: validationLibV1.address
  }, store.address)

  await protocol.addContract(key.PROTOCOL.CNS.LIQUIDITY_ENGINE, liquidityEngine.address)

  const vault = await composer.vault.getVault({
    store: store,
    libs: {
      accessControlLibV1: accessControlLibV1,
      baseLibV1: baseLibV1,
      transferLib: transferLib,
      protoUtilV1: protoUtilV1,
      registryLibV1: registryLibV1,
      validationLibV1: validationLibV1
    }
  }, coverKey)

  await dai.approve(vault.address, initialLiquidity)
  await npm.approve(vault.address, minReportingStake)
  await vault.addLiquidity(coverKey, initialLiquidity, minReportingStake, key.toBytes32(''))

  return {
    npm,
    dai,
    npmDai,
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
    transferLib,
    priceLibV1,
    protocol,
    routineInvokerLibV1,
    cover,
    coverLibV1,
    policyHelperV1,
    strategyLibV1,
    stakingContract,
    reassuranceContract,
    governance,
    resolution,
    vault,
    liquidityEngine,
    minReportingStake
  }
}

module.exports = { deployDependencies }
