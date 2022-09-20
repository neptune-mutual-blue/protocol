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

describe('Store: delete string', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly delete string', async () => {
    const k = key.toBytes32('test:string')
    const value = uuid.v4()
    await store.setString(k, value)

    let result = await store.getString(k)
    result.should.equal(value)

    await store.deleteString(k)

    result = await store.getString(k)
    result.should.equal('')
  })

  it('must revert if the store is paused', async () => {
    const k = key.toBytes32('test:string')
    const value = uuid.v4()

    await store.setString(k, value)

    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    await store.deleteString(k)
      .should.be.rejectedWith('Pausable: paused')

    await store.unpause()

    await store.deleteString(k)
      .should.not.be.rejected
  })

  it('must revert if the sender is not a store or protocol member', async () => {
    const [, bob] = await ethers.getSigners()

    const k = key.toBytes32('test:string')
    const value = uuid.v4()

    await store.setString(k, value)

    await store.connect(bob).deleteString(k)
      .should.be.rejectedWith('Forbidden')
  })
})
