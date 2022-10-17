/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('cxTokenFactory: Constructor and Views', () => {
  let store, deployed

  before(async () => {
    deployed = await deployDependencies()

    store = deployed.store
  })

  it('correctly deploys', async () => {
    const factory = await deployer.deployWithLibraries(cache, 'cxTokenFactory', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address,
      cxTokenFactoryLibV1: deployed.cxTokenFactoryLib.address
    }, store.address)

    const _store = await factory.s()
    _store.should.equal(store.address)

    const version = await factory.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await factory.getName()
    name.should.equal(key.PROTOCOL.CNAME.CXTOKEN_FACTORY)
  })
})
