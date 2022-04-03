/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: delete uint', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly delete uint', async () => {
    const k = key.toBytes32('test:uint')
    const value = helper.getRandomNumber(10000000, 100000000).toString()
    await store.setUint(k, value)

    let result = await store.getUint(k)
    result.should.equal(value)

    await store.deleteUint(k)

    result = await store.getUint(k)
    result.should.equal('0')
  })

  it('must revert if the store is paused', async () => {
    const k = key.toBytes32('test:uint')
    const value = helper.getRandomNumber(10000000, 100000000).toString()

    await store.setUint(k, value)

    await store.pause()

    await store.deleteUint(k)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.deleteUint(k)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:uint')
    const value = helper.getRandomNumber(10000000, 100000000).toString()

    await store.setUint(k, value)

    await store.connect(bob).deleteUint(k)
      .should.be.rejectedWith('Forbidden')
  })
})
