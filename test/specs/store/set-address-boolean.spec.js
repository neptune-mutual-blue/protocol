/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { deployer, key, helper } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: set address boolean', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly set address boolean', async () => {
    const k = key.toBytes32('test:address:boolean')
    const address = helper.randomAddress()
    const value = Math.random() < 0.5

    await store.setAddressBoolean(k, address, value)

    const result = await store.getAddressBoolean(k, address)
    result.should.equal(value)
  })

  it('must revert if the store is paused', async () => {
    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    const k = key.toBytes32('test:address:boolean')
    const address = helper.randomAddress()
    const value = Math.random() < 0.5

    await store.setAddressBoolean(k, address, value)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.setAddressBoolean(k, address, value)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:address:boolean')
    const address = helper.randomAddress()
    const value = Math.random() < 0.5

    await store.connect(bob).setAddressBoolean(k, address, value)
      .should.be.rejectedWith('Forbidden')
  })
})
