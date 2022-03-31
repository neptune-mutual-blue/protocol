/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Bond Pool Constructor and Views', () => {
  let store, bondPoolLibV1, accessControlLibV1, baseLibV1, priceLibV1, validationLibV1

  before(async () => {
    const deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    validationLibV1 = deployed.validationLibV1
    bondPoolLibV1 = deployed.bondPoolLibV1
    priceLibV1 = deployed.priceLibV1
  })

  it('correctly deploys', async () => {
    const bondPoolContract = await deployer.deployWithLibraries(cache, 'BondPool', {
      AccessControlLibV1: accessControlLibV1.address,
      BondPoolLibV1: bondPoolLibV1.address,
      BaseLibV1: baseLibV1.address,
      PriceLibV1: priceLibV1.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    bondPoolContract.address.should.not.be.empty
    bondPoolContract.address.should.not.equal(helper.zerox)
    ; (await bondPoolContract.version()).should.equal(key.toBytes32('v0.1'))
    ; (await bondPoolContract.getName()).should.equal(key.PROTOCOL.CNAME.BOND_POOL)
  })
})
