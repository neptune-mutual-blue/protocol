const fakesComposer = require('./fakes')
const storeComposer = require('./store')
const fakeTokenComposer = require('./token')
const fakeUniswapPairComposer = require('./uniswap-pair')
const libsComposer = require('./libs')
const { deployer, key, sample, helper, intermediate, fileCache } = require('..')
const DAYS = 86400

/**
 * Initializes all contracts
 * @return {Promise<Contracts>}
 */
const initialize = async (suite, deploymentId) => {
  const [owner] = await ethers.getSigners()
  const cache = suite ? null : await fileCache.from(deploymentId)

  const store = await storeComposer.deploy(cache)
  const fakes = await fakesComposer.deployAll(cache)

  const [npm, wxDai, comp, bal] = await fakeTokenComposer.deploySeveral(cache, [
    { name: 'Neptune Mutual Token', symbol: 'NPM' },
    { name: 'Wrapped Dai', symbol: 'WXDAI' },
    { name: 'Compound', symbol: 'COMP' },
    { name: 'Balancer', symbol: 'BAL' }
  ])

  const [npmUsdPair, compUsdPair, balUsdPair] = await fakeUniswapPairComposer.deploySeveral(cache, [
    { token0: npm.address, token1: wxDai.address },
    { token0: comp.address, token1: wxDai.address },
    { token0: bal.address, token1: wxDai.address }
  ])

  // The protocol only supports stablecoin as reassurance token for now
  const reassuranceToken = wxDai

  const libs = await libsComposer.deployAll(cache)

  const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
    {
      StoreKeyUtil: libs.storeKeyUtil.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      AccessControlLibV1: libs.accessControlLibV1.address,
      ValidationLibV1: libs.validationLib.address,
      BaseLibV1: libs.baseLibV1.address
    },
    store.address
  )

  await intermediate(cache, store, 'setBool', key.qualify(protocol.address), true)
  await intermediate(cache, store, 'setBool', key.qualifyMember(protocol.address), true)

  await intermediate(cache, protocol, 'grantRole', key.toBytes32(key.NS.ROLES.UPGRADE_AGENT), owner.address)

  await intermediate(cache, protocol, 'initialize',
    [helper.zero1,
      fakes.router.address,
      npm.address,
      sample.fake.TREASURY,
      sample.fake.REASSURANCE_VAULT],
    [helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Governance Burn Rate: 30%
      helper.ether(0.1), // Governance Reporter Commission: 10%
      helper.ether(0.065), // Claim: Platform Fee: 6.5%
      helper.ether(0.005) // Claim: Reporter Commission: 5%
    ]
  )

  const bondPoolContract = await deployer.deployWithLibraries(cache, 'BondPool', {
    BondPoolLibV1: libs.bondPoolLibV1.address,
    BaseLibV1: libs.baseLibV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.BOND_POOL), bondPoolContract.address)

  await intermediate(cache, npm, 'approve', bondPoolContract.address, helper.ether(2_000_000))
  let addresses = [npmUsdPair.address, sample.fake.TREASURY]
  let values = [helper.ether(0.0075625), helper.ether(10_000), 7 * DAYS, helper.ether(2_000_000)]

  await intermediate(cache, bondPoolContract, 'setup', addresses, values)

  const stakingPoolContract = await deployer.deployWithLibraries(cache, 'StakingPools', {
    StakingPoolLibV1: libs.stakingPoolLibV1.address,
    AccessControlLibV1: libs.accessControlLibV1.address,
    NTransferUtilV2: libs.transferLib.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ValidationLibV1: libs.validationLib.address,
    BaseLibV1: libs.baseLibV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.STAKING_POOL), stakingPoolContract.address)

  await intermediate(cache, comp, 'approve', stakingPoolContract.address, helper.ether(10_000))
  addresses = [npm.address, npmUsdPair.address, comp.address, compUsdPair.address]
  values = [helper.ether(100_000_000), helper.ether(10_000), helper.ether(0.025), 342, 1 * DAYS, helper.ether(10_000)]

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', key.toBytes32('Compound'), 'Compound Staking Pool', 1, addresses, values)

  const stakingContract = await deployer.deployWithLibraries(cache, 'CoverStake', {
    BaseLibV1: libs.baseLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    CoverUtilV1: libs.coverUtil.address,
    NTransferUtilV2: libs.transferLib.address,
    ValidationLibV1: libs.validationLib.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.COVER_STAKE), stakingContract.address)

  const reassuranceContract = await deployer.deployWithLibraries(cache, 'CoverReassurance', {
    BaseLibV1: libs.baseLibV1.address,
    AccessControlLibV1: libs.accessControlLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    NTransferUtilV2: libs.transferLib.address,
    ValidationLibV1: libs.validationLib.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.COVER_REASSURANCE), reassuranceContract.address)

  const vaultFactory = await deployer.deployWithLibraries(cache, 'VaultFactory',
    {
      BaseLibV1: libs.baseLibV1.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      VaultFactoryLibV1: libs.vaultFactoryLib.address,
      ValidationLibV1: libs.validationLib.address
    }
    , store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.COVER_VAULT_FACTORY), vaultFactory.address)

  const cxTokenFactory = await deployer.deployWithLibraries(cache, 'cxTokenFactory',
    {
      BaseLibV1: libs.baseLibV1.address,
      cxTokenFactoryLibV1: libs.cxTokenFactoryLib.address,
      ValidationLibV1: libs.validationLib.address,
      StoreKeyUtil: libs.storeKeyUtil.address
    }
    , store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.COVER_CXTOKEN_FACTORY), cxTokenFactory.address)

  const governance = await deployer.deployWithLibraries(cache, 'Governance',
    {
      BaseLibV1: libs.baseLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      CoverUtilV1: libs.coverUtil.address,
      NTransferUtilV2: libs.transferLib.address,
      ValidationLibV1: libs.validationLib.address,
      GovernanceUtilV1: libs.governanceLib.address,
      RegistryLibV1: libs.registryLib.address,
      AccessControlLibV1: libs.accessControlLibV1.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.GOVERNANCE), governance.address)

  const resolution = await deployer.deployWithLibraries(cache, 'Resolution',
    {
      AccessControlLibV1: libs.accessControlLibV1.address,
      BaseLibV1: libs.baseLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      CoverUtilV1: libs.coverUtil.address,
      NTransferUtilV2: libs.transferLib.address,
      ValidationLibV1: libs.validationLib.address,
      GovernanceUtilV1: libs.governanceLib.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.RESOLUTION), resolution.address)

  const cover = await deployer.deployWithLibraries(cache, 'Cover',
    {
      BaseLibV1: libs.baseLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      AccessControlLibV1: libs.accessControlLibV1.address,
      CoverUtilV1: libs.coverUtil.address,
      NTransferUtilV2: libs.transferLib.address,
      ValidationLibV1: libs.validationLib.address,
      RegistryLibV1: libs.registryLib.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.COVER), cover.address)

  const provisionContract = await deployer.deployWithLibraries(cache, 'CoverProvision', {
    BaseLibV1: libs.baseLibV1.address,
    AccessControlLibV1: libs.accessControlLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    NTransferUtilV2: libs.transferLib.address,
    ValidationLibV1: libs.validationLib.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.COVER_PROVISION), provisionContract.address)

  const policyAdminContract = await deployer.deployWithLibraries(cache, 'PolicyAdmin', {
    BaseLibV1: libs.baseLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    AccessControlLibV1: libs.accessControlLibV1.address,
    ValidationLibV1: libs.validationLib.address,
    CoverUtilV1: libs.coverUtil.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.COVER_POLICY_ADMIN), policyAdminContract.address)

  await intermediate(cache, protocol, 'grantRole', key.toBytes32(key.NS.ROLES.COVER_MANAGER), owner.address)
  await intermediate(cache, policyAdminContract, 'setPolicyRates', helper.ether(0.07), helper.ether(0.45))
  await intermediate(cache, cover, 'updateWhitelist', owner.address, true)

  const policy = await deployer.deployWithLibraries(cache, 'Policy', {
    BaseLibV1: libs.baseLibV1.address,
    CoverUtilV1: libs.coverUtil.address,
    NTransferUtilV2: libs.transferLib.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    RegistryLibV1: libs.registryLib.address,
    ValidationLibV1: libs.validationLib.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.COVER_POLICY), policy.address)

  const claimsProcessor = await deployer.deployWithLibraries(cache, 'Processor',
    {
      BaseLibV1: libs.baseLibV1.address,
      NTransferUtilV2: libs.transferLib.address,
      RegistryLibV1: libs.registryLib.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLib.address,
      AccessControlLibV1: libs.accessControlLibV1.address,
      GovernanceUtilV1: libs.governanceLib.address,
      ProtoUtilV1: libs.protoUtilV1.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.CLAIM_PROCESSOR), claimsProcessor.address)

  const priceDiscovery = await deployer.deployWithLibraries(cache, 'PriceDiscovery', {
    BaseLibV1: libs.baseLibV1.address,
    ProtoUtilV1: libs.protoUtilV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.CNS.PRICE_DISCOVERY), priceDiscovery.address)

  await intermediate(cache, cover, 'initialize', wxDai.address, key.toBytes32('WXDAI'))

  return {
    store,
    npm,
    wxDai,
    comp,
    bal,
    npmUsdPair,
    compUsdPair,
    balUsdPair,
    reassuranceToken,
    protocol,
    stakingContract,
    reassuranceContract,
    provisionContract,
    vaultFactory,
    cxTokenFactory,
    cover,
    priceDiscovery,
    policyAdminContract,
    policy,
    governance,
    resolution,
    claimsProcessor,
    bondPoolContract,
    stakingPoolContract,
    libs
  }
}

module.exports = { initialize }
