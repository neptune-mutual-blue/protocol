/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: updateCoverUsersWhitelist', () => {
  let deployed

  const coverKey = key.toBytes32('foo-bar')
  const stakeWithFee = helper.ether(10_000)
  const initialReassuranceAmount = helper.ether(1_000_000)
  const minReportingStake = helper.ether(250)
  const reportingPeriod = 7 * DAYS
  const cooldownPeriod = 1 * DAYS
  const claimPeriod = 7 * DAYS
  const floor = helper.percentage(7)
  const ceiling = helper.percentage(45)
  const reassuranceRate = helper.percentage(50)

  const requiresWhitelist = false
  const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate]
  const info = key.toBytes32('info')

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly whitelist the user', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, deployed.dai.address, requiresWhitelist, values)
    await deployed.cover.deployVault(coverKey)

    const statusBefore = await deployed.cover.checkIfWhitelistedUser(coverKey, owner.address)
    await deployed.cover.updateCoverUsersWhitelist(coverKey, [owner.address], [true])
    const statusAfter = await deployed.cover.checkIfWhitelistedUser(coverKey, owner.address)

    statusBefore.should.equal(false)
    statusAfter.should.equal(true)
  })

  it('reverts when not accessed by CoverOwnerOrAdmin', async () => {
    const [owner, bob] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.cover.connect(bob).updateCoverUsersWhitelist(coverKey, [owner.address], [true])
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when protocol is paused', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.protocol.pause()

    await deployed.cover.updateCoverUsersWhitelist(coverKey, [owner.address], [true])
      .should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })
})
