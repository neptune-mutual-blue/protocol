const storeComposer = require('./store')
const tokenComposer = require('./token')
const libsComposer = require('./libs')
const { deployer, key, sample, helper } = require('../../util')

const initialize = async () => {
  const store = await storeComposer.deploy()

  const [nep, wxDai, assuranceToken] = await tokenComposer.deploySeveral([
    { name: 'Neptune Mutual Token', symbol: 'NEP' },
    { name: 'Wrapped Dai', symbol: 'WXDAI' },
    { name: 'Compound', symbol: 'CMP' }
  ])

  const libs = await libsComposer.deployAll()

  const protocol = await deployer.deployWithLibraries('Protocol',
    {
      StoreKeyUtil: libs.storeKeyUtil.address,
      ProtoUtilV1: libs.protoUtilV1.address
    },
    store.address
  )

  await store.setBool(key.qualify(protocol.address), true)
  await store.setBool(key.qualifyMember(protocol.address), true)

  await protocol.initialize(nep.address, sample.fake.TREASURY, sample.fake.ASSURANCE_VAULT)

  const stakingContract = await deployer.deployWithLibraries('CoverStake', {
    StoreKeyUtil: libs.storeKeyUtil.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    CoverUtilV1: libs.coverUtil.address,
    NTransferUtilV2: libs.transferLib.address,
    ValidationLibV1: libs.validationLib.address
  }, store.address)

  await protocol.addContract(key.toBytes32(key.NS.COVER_STAKE), stakingContract.address)

  const assuranceContract = await deployer.deployWithLibraries('CoverAssurance', {
    StoreKeyUtil: libs.storeKeyUtil.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    NTransferUtilV2: libs.transferLib.address,
    ValidationLibV1: libs.validationLib.address
  }, store.address)

  await protocol.addContract(key.toBytes32(key.NS.COVER_ASSURANCE), assuranceContract.address)

  const vaultFactory = await deployer.deployWithLibraries('VaultFactory',
    {
      ProtoUtilV1: libs.protoUtilV1.address,
      VaultFactoryLibV1: libs.vaultFactoryLib.address,
      ValidationLibV1: libs.validationLib.address
    }
    , store.address
  )

  await protocol.addContract(key.toBytes32(key.NS.COVER_VAULT_FACTORY), vaultFactory.address)

  const cTokenFactory = await deployer.deployWithLibraries('cTokenFactory',
    {
      ProtoUtilV1: libs.protoUtilV1.address,
      cTokenFactoryLibV1: libs.cTokenFactoryLib.address,
      ValidationLibV1: libs.validationLib.address
    }
    , store.address
  )

  await protocol.addContract(key.toBytes32(key.NS.COVER_CTOKEN_FACTORY), cTokenFactory.address)

  const cover = await deployer.deployWithLibraries('Cover',
    {
      StoreKeyUtil: libs.storeKeyUtil.address,
      ProtoUtilV1: libs.protoUtilV1.address,
      CoverUtilV1: libs.coverUtil.address,
      NTransferUtilV2: libs.transferLib.address,
      ValidationLibV1: libs.validationLib.address,
      RegistryLibV1: libs.registryLib.address
    },
    store.address
  )

  await protocol.addContract(key.toBytes32(key.NS.COVER), cover.address)

  await cover.initialize(wxDai.address, key.toBytes32('WXDAI'))

  const provisionContract = await deployer.deployWithLibraries('CoverProvision', {
    StoreKeyUtil: libs.storeKeyUtil.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    NTransferUtilV2: libs.transferLib.address,
    ValidationLibV1: libs.validationLib.address
  }, store.address)

  await protocol.addContract(key.toBytes32(key.NS.COVER_PROVISION), provisionContract.address)

  const policyAdminContract = await deployer.deployWithLibraries('PolicyAdmin', {
    StoreKeyUtil: libs.storeKeyUtil.address,
    ProtoUtilV1: libs.protoUtilV1.address,
    CoverUtilV1: libs.coverUtil.address
  }, store.address)

  await protocol.addContract(key.toBytes32(key.NS.COVER_POLICY_ADMIN), policyAdminContract.address)
  await policyAdminContract.setPolicyRates(helper.ether(0.07), helper.ether(0.45))

  const policy = await deployer.deployWithLibraries('Policy', {
    ProtoUtilV1: libs.protoUtilV1.address,
    CoverUtilV1: libs.coverUtil.address,
    NTransferUtilV2: libs.transferLib.address,
    RegistryLibV1: libs.registryLib.address
  }, store.address)

  await protocol.addContract(key.toBytes32(key.NS.COVER_POLICY), policy.address)

  const priceDiscovery = await deployer.deployWithLibraries('PriceDiscovery', {
    ProtoUtilV1: libs.protoUtilV1.address
  }, store.address)

  await protocol.addContract(key.toBytes32(key.NS.PRICE_DISCOVERY), priceDiscovery.address)

  return {
    store,
    nep,
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
    ...libs
  }
}

module.exports = { initialize }
