/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const uuid = require('uuid')
const { deployer, key, helper } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: delete bytes32', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly delete bytes32', async () => {
    const k = key.toBytes32('test:bytes32')
    const value = key.toBytes32(uuid.v4().substring(0, 30))
    await store.setBytes32(k, value)

    let result = await store.getBytes32(k)
    result.should.equal(value)

    await store.deleteBytes32(k)

    result = await store.getBytes32(k)
    result.should.equal(helper.emptyBytes32)
  })

  it('must revert if the store is paused', async () => {
    const k = key.toBytes32('test:bytes32')
    const value = key.toBytes32(uuid.v4().substring(0, 30))

    await store.setBytes32(k, value)

    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    await store.deleteBytes32(k)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.deleteBytes32(k)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:bytes32')
    const value = key.toBytes32(uuid.v4().substring(0, 30))

    await store.setBytes32(k, value)

    await store.connect(bob).deleteBytes32(k)
      .should.be.rejectedWith('Forbidden')
  })
})
