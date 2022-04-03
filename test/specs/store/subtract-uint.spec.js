/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: subtract uint', () => {
  let store, candidates

  before(async () => {
    candidates = []

    for (let i = 0; i < 10; i++) {
      candidates.push(helper.getRandomNumber(30000, 300000))
    }

    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly subtract uint', async () => {
    const k = key.toBytes32('test:uint')

    const value = helper.getRandomNumber(1000000000000, 1000000000000000)
    const expectation = value - candidates.reduce((a, b) => a + b, 0)

    await store.setUint(k, value.toString())

    let result = await store.getUint(k)
    result.should.equal(value.toString())

    for (const candidate of candidates) {
      await store.subtractUint(k, candidate.toString())
    }

    result = await store.getUint(k)
    result.should.equal(expectation)
  })

  it('must revert when underflown', async () => {
    const k = key.toBytes32('test:uint2')

    const value = ethers.BigNumber.from(helper.getRandomNumber(1000000000000, 1000000000000000))
    await store.setUint(k, value.toString())

    await store.subtractUint(k, value.add(1))
      .should.be.rejectedWith('Arithmetic operation underflowed')
  })

  it('must revert if the store is paused', async () => {
    await store.pause()

    const k = key.toBytes32('test:uint')
    const value = helper.getRandomNumber(30000, 3000000).toString()

    await store.subtractUint(k, value)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.subtractUint(k, value)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:uint')
    const value = helper.getRandomNumber(30000, 3000000).toString()

    await store.connect(bob).subtractUint(k, value)
      .should.be.rejectedWith('Forbidden')
  })
})
