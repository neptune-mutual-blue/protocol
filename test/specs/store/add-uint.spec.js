/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: add uint', () => {
  let store, values

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly add uint', async () => {
    values = []

    const k = key.toBytes32('test:uint')

    let value = helper.getRandomNumber(10000000, 100000000)
    values.push(value)

    await store.setUint(k, value.toString())

    for (let i = 0; i < 10; i++) {
      value = helper.getRandomNumber(10000000, 100000000)
      values.push(value)
      await store.addUint(k, value.toString())
    }

    const result = await store.getUint(k)
    result.should.equal(values.reduce((a, b) => a + b, 0))
  })

  it('must revert if the store is paused', async () => {
    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    const k = key.toBytes32('test:uint')
    const value = helper.getRandomNumber(10000000, 100000000).toString()

    await store.addUint(k, value)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.addUint(k, value)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:uint')
    const value = helper.getRandomNumber(10000000, 100000000).toString()

    await store.connect(bob).addUint(k, value)
      .should.be.rejectedWith('Forbidden')
  })
})
