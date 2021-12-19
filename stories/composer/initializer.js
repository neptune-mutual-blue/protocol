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

  const [npm, wxDai, assuranceToken] = await tokenComposer.deploySeveral(cache, [
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
    fakes.router.address,
    npm.address,
    sample.fake.TREASURY,
    sample.fake.ASSURANCE_VAULT,
    helper.ether(0), // Cover Fee
    helper.ether(0), // Min Cover Stake
    helper.ether(250), // Min Reporting Stake
    7 * DAYS, // Min liquidity period
    7 * DAYS // Claim period
  )

  const stakingContract = await deployer.deployWithLibraries(cache, 'CoverStake', {
    BaseLibV1: libs.baseLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    CoverUtilV1: libs.coverUtil.address,
    NTransferUtilV2: libs.transferLib.address,
    ValidationLibV1: libs.validationLib.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.COVER_STAKE), stakingContract.address)

  const assuranceContract = await deployer.deployWithLibraries(cache, 'CoverAssurance', {
    BaseLibV1: libs.baseLibV1.address,
    AccessControlLibV1: libs.accessControlLibV1.address,
    StoreKeyUtil: libs.storeKeyUtil.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    NTransferUtilV2: libs.transferLib.address,
    ValidationLibV1: libs.validationLib.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.COVER_ASSURANCE), assuranceContract.address)

  const vaultFactory = await deployer.deployWithLibraries(cache, 'VaultFactory',
    {
      BaseLibV1: libs.baseLibV1.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      VaultFactoryLibV1: libs.vaultFactoryLib.address,
      ValidationLibV1: libs.validationLib.address
    }
    , store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.COVER_VAULT_FACTORY), vaultFactory.address)

  const cTokenFactory = await deployer.deployWithLibraries(cache, 'cTokenFactory',
    {
      BaseLibV1: libs.baseLibV1.address,
      cTokenFactoryLibV1: libs.cTokenFactoryLib.address,
      ValidationLibV1: libs.validationLib.address
    }
    , store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.COVER_CTOKEN_FACTORY), cTokenFactory.address)

  const governance = await deployer.deployWithLibraries(cache, 'Governance',
    {
      BaseLibV1: libs.baseLibV1.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      CoverUtilV1: libs.coverUtil.address,
      NTransferUtilV2: libs.transferLib.address,
      ValidationLibV1: libs.validationLib.address,
      GovernanceUtilV1: libs.governanceLib.address,
      RegistryLibV1: libs.registryLib.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.GOVERNANCE), governance.address)

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

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.RESOLUTION), resolution.address)

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

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.COVER), cover.address)

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

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.COVER_POLICY_ADMIN), policyAdminContract.address)

  await intermediate(cache, protocol, 'grantRole', key.toBytes32(key.NS.ROLES.COVER_MANAGER), owner.address)
  await intermediate(cache, policyAdminContract, 'setPolicyRates', helper.ether(0.07), helper.ether(0.45))
  await intermediate(cache, cover, 'updateWhitelist', owner.address, true)

  const policy = await deployer.deployWithLibraries(cache, 'Policy', {
    BaseLibV1: libs.baseLibV1.address,
    CoverUtilV1: libs.coverUtil.address,
    NTransferUtilV2: libs.transferLib.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    RegistryLibV1: libs.registryLib.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.COVER_POLICY), policy.address)

  const claimsProcessor = await deployer.deployWithLibraries(cache, 'Processor',
    {
      BaseLibV1: libs.baseLibV1.address,
      NTransferUtilV2: libs.transferLib.address,
      RegistryLibV1: libs.registryLib.address,
      StoreKeyUtil: libs.storeKeyUtil.address,
      ValidationLibV1: libs.validationLib.address
    },
    store.address
  )

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.CLAIMS_PROCESSOR), claimsProcessor.address)

  const priceDiscovery = await deployer.deployWithLibraries(cache, 'PriceDiscovery', {
    BaseLibV1: libs.baseLibV1.address,
    ProtoUtilV1: libs.protoUtilV1.address
  }, store.address)

  await intermediate(cache, protocol, 'addContract', key.toBytes32(key.NS.PRICE_DISCOVERY), priceDiscovery.address)

  await intermediate(cache, cover, 'initialize', wxDai.address, key.toBytes32('WXDAI'))

  return {
    store,
    npm,
    wxDai,
    assuranceToken,
    protocol,
    stakingContract,
    assuranceContract,
    provisionContract,
    vaultFactory,
    cTokenFactory,
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
