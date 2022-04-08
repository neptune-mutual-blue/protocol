/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('PriceDiscovery: Constructor and Views', () => {
  let store,
    accessControlLibV1,
    baseLibV1,
    priceLibV1,
    validationLibV1,
    protoUtilV1

  before(async () => {
    const deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    priceLibV1 = deployed.priceLibV1
    validationLibV1 = deployed.validationLibV1
    protoUtilV1 = deployed.protoUtilV1
  })

  it('correctly deploys', async () => {
    const discoceryContract = await deployer.deployWithLibraries(cache, 'PriceDiscovery', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      PriceLibV1: priceLibV1.address,
      ProtoUtilV1: protoUtilV1.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    const _store = await discoceryContract.s()
    _store.should.equal(store.address)

    const version = await discoceryContract.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await discoceryContract.getName()
    name.should.equal(key.PROTOCOL.CNAME.PRICE_DISCOVERY)
  })
})
