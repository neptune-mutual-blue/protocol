/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { deployer, key, helper } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: set address array item', () => {
  let store, items

  before(async () => {
    items = []
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly set address array item', async () => {
    const k = key.toBytes32('test:address:array:item')

    let item = helper.randomAddress()
    items.push(item)

    await store.setAddressArrayItem(k, item)
    await store.setAddressArrayItem(k, item) // same item added multiple times should not change tge result

    item = helper.randomAddress()
    items.push(item)

    await store.setAddressArrayItem(k, item)

    item = helper.randomAddress()
    items.push(item)

    await store.setAddressArrayItem(k, item)
    await store.deleteAddressArrayItem(k, item)

    items.pop()

    const result = await store.getAddressArray(k)
    result.should.deep.equal(items)
  })

  it('must revert if the store is paused', async () => {
    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    const k = key.toBytes32('test:address:array:item')
    const item = helper.randomAddress()

    await store.setAddressArrayItem(k, item)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.setAddressArrayItem(k, item)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:address:array:item')
    const item = helper.randomAddress()

    await store.connect(bob).setAddressArrayItem(k, item)
      .should.be.rejectedWith('Forbidden')
  })
})
