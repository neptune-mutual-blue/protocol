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
  let store,
    accessControlLibV1,
    baseLibV1,
    storeKeyUtil,
    validationLibV1,
    cxTokenFactoryLib

  before(async () => {
    const deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    storeKeyUtil = deployed.storeKeyUtil
    validationLibV1 = deployed.validationLibV1
    cxTokenFactoryLib = deployed.cxTokenFactoryLib
  })

  it('correctly deploys', async () => {
    const vault = await deployer.deployWithLibraries(cache, 'cxTokenFactory', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address,
      cxTokenFactoryLibV1: cxTokenFactoryLib.address
    }, store.address)

    const _store = await vault.s()
    _store.should.equal(store.address)

    const version = await vault.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await vault.getName()
    name.should.equal(key.PROTOCOL.CNAME.CXTOKEN_FACTORY)
  })
})
