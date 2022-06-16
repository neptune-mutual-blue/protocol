/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../../util')
const { deployDependencies } = require('./deps')
const PRECISION = helper.STABLECOIN_DECIMALS
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault Constructor and Views', () => {
  let store,
    accessControlLibV1,
    baseLibV1,
    transferLib,
    protoUtilV1,
    registryLibV1,
    validationLibV1

  beforeEach(async () => {
    const deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    transferLib = deployed.transferLib
    protoUtilV1 = deployed.protoUtilV1
    registryLibV1 = deployed.registryLibV1
    validationLibV1 = deployed.validationLibV1
  })

  it('correctly deploys', async () => {
    const coverKey = key.toBytes32('test')
    const liquidityToken = await deployer.deploy(cache, 'FakeToken', 'DAI Token', 'DAI', helper.ether(100_000_000, PRECISION), PRECISION)

    const vault = await deployer.deployWithLibraries(cache, 'Vault', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      ValidationLibV1: validationLibV1.address
    }, store.address, coverKey, 'Vault', 'VAULT', liquidityToken.address)

    const _store = await vault.s()
    _store.should.equal(store.address)

    const version = await vault.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await vault.getName()
    name.should.equal(key.PROTOCOL.CNAME.LIQUIDITY_VAULT)
  })
})
