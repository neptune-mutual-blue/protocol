/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: delete int', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly delete int', async () => {
    const k = key.toBytes32('test:int')
    const value = helper.getRandomNumber(-100000000, 100000000).toString()
    await store.setInt(k, value)

    let result = await store.getInt(k)
    result.should.equal(value)

    await store.deleteInt(k)

    result = await store.getInt(k)
    result.should.equal('0')
  })

  it('must revert if the store is paused', async () => {
    const k = key.toBytes32('test:int')
    const value = helper.getRandomNumber(-100000000, 100000000).toString()

    await store.setInt(k, value)

    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    await store.deleteInt(k)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.deleteInt(k)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:int')
    const value = helper.getRandomNumber(-100000000, 100000000).toString()

    await store.setInt(k, value)

    await store.connect(bob).deleteInt(k)
      .should.be.rejectedWith('Forbidden')
  })
})
