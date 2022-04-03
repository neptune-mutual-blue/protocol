/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: delete address array item by index', () => {
  let store, items, k

  before(async () => {
    items = [helper.randomAddress(), helper.randomAddress(), helper.randomAddress(), helper.randomAddress(), helper.randomAddress()]
    store = await deployer.deploy(cache, 'Store')

    k = key.toBytes32('test:address:array:item')

    for (const item of items) {
      await store.setAddressArrayItem(k, item)
    }
  })

  it('must correctly delete address array items by indices', async () => {
    const index = 1
    await store.deleteAddressArrayItemByIndex(k, index)
    items.splice(index, 1)

    const result = await store.getAddressArray(k)
   ; [...result].sort().should.deep.equal([...items].sort())
  })

  it('must revert with an error if an invalid index is specified', async () => {
    await store.deleteAddressArrayItemByIndex(k, 10)
      .should.be.rejectedWith('Invalid index')
  })
})
