/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { deployer, key, helper } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: set bytes32 array item', () => {
  let store, items

  before(async () => {
    items = []
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly set bytes32 array item', async () => {
    const k = key.toBytes32('test:bytes32:array:item')

    let item = helper.randomPrivateKey()
    items.push(item)

    await store.setBytes32ArrayItem(k, item)
    await store.setBytes32ArrayItem(k, item) // same item added multiple times should not change tge result

    item = helper.randomPrivateKey()
    items.push(item)

    await store.setBytes32ArrayItem(k, item)

    item = helper.randomPrivateKey()
    items.push(item)

    await store.setBytes32ArrayItem(k, item)
    await store.deleteBytes32ArrayItem(k, item)

    items.pop()

    const result = await store.getBytes32Array(k)
    result.should.deep.equal(items)
  })

  it('must revert if the store is paused', async () => {
    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    const k = key.toBytes32('test:bytes32:array:item')
    const item = helper.randomPrivateKey()

    await store.setBytes32ArrayItem(k, item)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.setBytes32ArrayItem(k, item)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:bytes32:array:item')
    const item = helper.randomPrivateKey()

    await store.connect(bob).setBytes32ArrayItem(k, item)
      .should.be.rejectedWith('Forbidden')
  })
})
