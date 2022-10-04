/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('VaultFactory Constructor and Views', () => {
  let store, deployed

  before(async () => {
    deployed = await deployDependencies()

    store = deployed.store
  })

  it('correctly deploys', async () => {
    const vault = await deployer.deployWithLibraries(cache, 'VaultFactory', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      ValidationLibV1: deployed.validationLibV1.address,
      VaultFactoryLibV1: deployed.vaultFactoryLibV1.address
    }, store.address)

    const _store = await vault.s()
    _store.should.equal(store.address)

    const version = await vault.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await vault.getName()
    name.should.equal(key.PROTOCOL.CNAME.VAULT_FACTORY)
  })
})
