/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: updateCoverUsersWhitelist', () => {
  let deployed

  const coverKey = key.toBytes32('foo-bar')
  const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
  const stakeWithFee = helper.ether(10_000)
  const minStakeToReport = helper.ether(250)
  const reportingPeriod = 7 * DAYS
  const cooldownPeriod = 1 * DAYS
  const claimPeriod = 7 * DAYS
  const floor = helper.percentage(7)
  const ceiling = helper.percentage(45)
  const reassuranceRate = helper.percentage(50)
  const leverageFactor = '1'

  const info = key.toBytes32('info')

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly whitelist the user', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
      coverKey,
      info,
      tokenName: 'POD',
      tokenSymbol: 'POD',
      supportsProducts: false,
      requiresWhitelist: false,
      stakeWithFee,
      initialReassuranceAmount,
      minStakeToReport,
      reportingPeriod,
      cooldownPeriod,
      claimPeriod,
      floor,
      ceiling,
      reassuranceRate,
      leverageFactor
    })

    const statusBefore = await deployed.cover.checkIfWhitelistedUser(coverKey, helper.emptyBytes32, owner.address)
    await deployed.cover.updateCoverUsersWhitelist(coverKey, helper.emptyBytes32, [owner.address], [true])
    const statusAfter = await deployed.cover.checkIfWhitelistedUser(coverKey, helper.emptyBytes32, owner.address)

    statusBefore.should.equal(false)
    statusAfter.should.equal(true)
  })

  it('reverts when not accessed by CoverOwnerOrAdmin', async () => {
    const [owner, bob] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.cover.connect(bob).updateCoverUsersWhitelist(coverKey, helper.emptyBytes32, [owner.address], [true])
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when protocol is paused', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.protocol.pause()

    await deployed.cover.updateCoverUsersWhitelist(coverKey, helper.emptyBytes32, [owner.address], [true])
      .should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })
})
