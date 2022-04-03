/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: delete address array item', () => {
  let store, items, k, toDelete

  before(async () => {
    items = [helper.randomAddress(), helper.randomAddress(), helper.randomAddress(), helper.randomAddress(), helper.randomAddress()]
    toDelete = items[2]

    store = await deployer.deploy(cache, 'Store')

    k = key.toBytes32('test:address:array:item')

    for (const item of items) {
      await store.setAddressArrayItem(k, item)
    }
  })

  it('must correctly delete an address array item', async () => {
    await store.deleteAddressArrayItem(k, toDelete)

    const result = await store.getAddressArray(k)
   ; [...result].sort().should.deep.equal(items.filter(x => x !== toDelete).sort())
  })

  it('must revert with an error if an invalid address is specified', async () => {
    await store.deleteAddressArrayItem(k, helper.randomAddress())
      .should.be.rejectedWith('Not found')
  })
})
