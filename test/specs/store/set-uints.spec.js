/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: set uints', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly set uints', async () => {
    const k = key.toBytes32('test:uints')
    const value = [ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString()), ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString())]
    await store.setUints(k, value)

    const result = await store.getUints(k)
    result.should.deep.equal(value)
  })

  it('must revert if the store is paused', async () => {
    await store.pause()

    const k = key.toBytes32('test:uints')
    const value = [ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString()), ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString())]

    await store.setUints(k, value)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.setUints(k, value)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:uints')
    const value = [ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString()), ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString())]

    await store.connect(bob).setUints(k, value)
      .should.be.rejectedWith('Forbidden')
  })
})
