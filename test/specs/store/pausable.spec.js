/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: Pausable', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must allow a pauser to pause the store', async () => {
    const [owner] = await ethers.getSigners()
    await store.setPausers([owner.address], [true])
    await store.pause()

    const state = await store.paused()

    state.should.be.true
  })

  it('must throw if the store is paused', async () => {
    await store.setUint(key.toBytes32('test'), '1')
      .should.be.rejectedWith('Pausable: paused')
  })

  it('must allow the owner to unpause the store', async () => {
    await store.unpause()

    const state = await store.paused()
    state.should.be.false
  })

  it('must allow store member to update the store', async () => {
    await store.setUint(key.toBytes32('test'), '1')
      .should.not.be.rejected
  })
})
