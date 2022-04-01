/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployDependencies } = require('./deps')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: updateCoverCreatorWhitelist', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly whitelists cover creator', async () => {
    const [owner, bob] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    const isWhitelistedOwner = await deployed.cover.checkIfWhitelistedCoverCreator(owner.address)
    isWhitelistedOwner.should.equal(true)

    const isWhitelistedBob = await deployed.cover.checkIfWhitelistedCoverCreator(bob.address)
    isWhitelistedBob.should.equal(false)
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()

    const [owner] = await ethers.getSigners()
    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)
      .should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })

  it('reverts when not accessed by CoverManager', async () => {
    const [owner, bob] = await ethers.getSigners()

    await deployed.cover.connect(bob).updateCoverCreatorWhitelist(owner.address, true)
      .should.be.rejectedWith('Forbidden')
  })
})
