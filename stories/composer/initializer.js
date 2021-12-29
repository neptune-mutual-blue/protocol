const fakesComposer = require('./fakes')
const storeComposer = require('./store')
const tokenComposer = require('./token')
const libsComposer = require('./libs')
const { deployer, key, sample, helper, intermediate, fileCache } = require('../../util')
const DAYS = 86400

/**
 * Initializes all contracts
 * @return {Contracts}
 */
const initialize = async (suite, deploymentId) => {
  const [owner] = await ethers.getSigners()
  const cache = suite ? null : await fileCache.from(deploymentId)

  const store = await storeComposer.deploy(cache)
  const fakes = await fakesComposer.deployAll(cache)

  const [npm, wxDai, reassuranceToken] = await tokenComposer.deploySeveral(cache, [
    { name: 'Neptune Mutual Token', symbol: 'NPM' },
    { name: 'Wrapped Dai', symbol: 'WXDAI' },
    { name: 'Compound', symbol: 'CMP' }
  ])

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
    libs
  }
}

module.exports = { initialize }
