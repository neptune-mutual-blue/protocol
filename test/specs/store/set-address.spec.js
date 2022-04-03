/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { deployer, key, helper } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: set address', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly set address', async () => {
    const k = key.toBytes32('test:address')
    const value = helper.randomAddress()
    await store.setAddress(k, value)

    const result = await store.getAddress(k)
    result.should.equal(value)
  })

  it('must revert if the store is paused', async () => {
    await store.pause()

    const k = key.toBytes32('test:address')
    const value = helper.randomAddress()

    await store.setAddress(k, value)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.setAddress(k, value)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:address')
    const value = helper.randomAddress()

    await store.connect(bob).setAddress(k, value)
      .should.be.rejectedWith('Forbidden')
  })
})
