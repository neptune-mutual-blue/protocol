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
    const values = [ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString()), ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString())]
    await store.setUints(k, values)

    const result = await store.getUints(k)

    for (const i in result) {
      result[i].should.equal(values[i])
    }
  })

  it('must revert if the store is paused', async () => {
    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    const k = key.toBytes32('test:uints')
    const values = [ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString()), ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString())]

    await store.setUints(k, values)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.setUints(k, values)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:uints')
    const values = [ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString()), ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString())]

    await store.connect(bob).setUints(k, values)
      .should.be.rejectedWith('Forbidden')
  })
})
