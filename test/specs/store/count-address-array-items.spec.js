/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: count address array items', () => {
  let store, items, k

  before(async () => {
    items = [helper.randomAddress(), helper.randomAddress(), helper.randomAddress(), helper.randomAddress()]

    store = await deployer.deploy(cache, 'Store')

    k = key.toBytes32('test:address:array:item')

    for (const item of items) {
      await store.setAddressArrayItem(k, item)
      await store.setAddressArrayItem(k, item) // same item added multiple times should not increase the count
    }
  })

  it('must correctly count address array items', async () => {
    const result = await store.countAddressArrayItems(k)
    result.should.equal(items.length.toString())
  })
})
