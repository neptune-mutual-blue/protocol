/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: set bool', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly set bool', async () => {
    const k = key.toBytes32('test:bool')
    const value = Math.random() < 0.5
    await store.setBool(k, value)

    const result = await store.getBool(k)
    result.should.equal(value)
  })

  it('must revert if the store is paused', async () => {
    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    const k = key.toBytes32('test:bool')
    const value = Math.random() < 0.5

    await store.setBool(k, value)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.setBool(k, value)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:bool')
    const value = Math.random() < 0.5

    await store.connect(bob).setBool(k, value)
      .should.be.rejectedWith('Forbidden')
  })
})
