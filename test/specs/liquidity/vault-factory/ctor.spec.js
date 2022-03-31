/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('VaultFactory Constructor and Views', () => {
  let store,
    accessControlLibV1,
    baseLibV1,
    protoUtilV1,
    validationLibV1,
    vaultFactoryLibV1

  beforeEach(async () => {
    const deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    protoUtilV1 = deployed.protoUtilV1
    validationLibV1 = deployed.validationLibV1
    vaultFactoryLibV1 = deployed.vaultFactoryLib
  })

  it('correctly deploys', async () => {
    const vault = await deployer.deployWithLibraries(cache, 'VaultFactory', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      ProtoUtilV1: protoUtilV1.address,
      ValidationLibV1: validationLibV1.address,
      VaultFactoryLibV1: vaultFactoryLibV1.address
    }, store.address)

    const _store = await vault.s()
    _store.should.equal(store.address)

    const version = await vault.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await vault.getName()
    name.should.equal(key.PROTOCOL.CNAME.VAULT_FACTORY)
  })
})
