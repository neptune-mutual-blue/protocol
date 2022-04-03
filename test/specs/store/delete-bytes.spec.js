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

describe('Store: delete bytes', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly delete bytes', async () => {
    const k = key.toBytes32('test:bytes')
    const value = helper.stringToHex(uuid.v4())
    await store.setBytes(k, value)

    let result = await store.getBytes(k)
    result.should.equal(value)

    await store.deleteBytes(k)

    result = await store.getBytes(k)
    result.should.equal('0x')
  })

  it('must revert if the store is paused', async () => {
    const k = key.toBytes32('test:bytes')
    const value = helper.stringToHex(uuid.v4())

    await store.setBytes(k, value)

    await store.pause()

    await store.deleteBytes(k)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.deleteBytes(k)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:bytes')
    const value = helper.stringToHex(uuid.v4())

    await store.setBytes(k, value)

    await store.connect(bob).deleteBytes(k)
      .should.be.rejectedWith('Forbidden')
  })
})
