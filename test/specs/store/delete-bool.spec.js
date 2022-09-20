/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: delete bool', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly delete bool', async () => {
    const k = key.toBytes32('test:bool')
    const value = Math.random() < 0.5

    await store.setBool(k, value)

    let result = await store.getBool(k)
    result.should.equal(value)

    await store.deleteBool(k)

    result = await store.getBool(k)
    result.should.be.false
  })

  it('must revert if the store is paused', async () => {
    const k = key.toBytes32('test:bool')
    const value = Math.random() < 0.5

    await store.setBool(k, value)

    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    await store.deleteBool(k)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.deleteBool(k)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:bool')
    const value = Math.random() < 0.5

    await store.setBool(k, value)

    await store.connect(bob).deleteBool(k)
      .should.be.rejectedWith('Forbidden')
  })
})
