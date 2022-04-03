/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const uuid = require('uuid')
const { deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: set string', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly set string', async () => {
    const k = key.toBytes32('test:string')
    const value = uuid.v4()
    await store.setString(k, value)

    const result = await store.getString(k)
    result.should.equal(value)
  })

  it('must revert if the store is paused', async () => {
    await store.pause()

    const k = key.toBytes32('test:string')
    const value = uuid.v4()

    await store.setString(k, value)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.setString(k, value)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:string')
    const value = uuid.v4()

    await store.connect(bob).setString(k, value)
      .should.be.rejectedWith('Forbidden')
  })
})
