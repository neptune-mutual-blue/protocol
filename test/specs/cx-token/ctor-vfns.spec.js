const moment = require('moment')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')

const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('cxToken: Constructor', () => {
  let libraries, cxToken, store

  const coverKey = key.toBytes32('test')
  const expiryDate = moment(new Date()).unix()

  beforeEach(async () => {
    libraries = await deployDependencies()
    store = { address: helper.randomAddress() }

    cxToken = await deployer.deployWithLibraries(cache, 'cxToken', libraries.dependencies, store.address, coverKey, expiryDate)
  })

  it('must correctly construct', async () => {
    cxToken.address.should.not.equal(helper.zerox)
  })

  it('must correctly store the storage variables', async () => {
    (await cxToken.coverKey()).should.equal(coverKey)
    ; (await cxToken.expiresOn()).toNumber().should.equal(expiryDate)
  })
})
