/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const uuid = require('uuid')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: set bytes', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly set bytes', async () => {
    const k = key.toBytes32('test:bytes')
    const value = helper.stringToHex(uuid.v4())
    await store.setBytes(k, value)

    const result = await store.getBytes(k)
    result.should.equal(value)
  })

  it('must revert if the store is paused', async () => {
    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    const k = key.toBytes32('test:bytes')
    const value = helper.stringToHex(uuid.v4())

    await store.setBytes(k, value)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.setBytes(k, value)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:bytes')
    const value = helper.stringToHex(uuid.v4())

    await store.connect(bob).setBytes(k, value)
      .should.be.rejectedWith('Forbidden')
  })
})
