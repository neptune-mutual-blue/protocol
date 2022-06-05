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

describe('Cover: addCover', () => {
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
  const placeholderValue = '1'

  const requiresWhitelist = false
  const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, placeholderValue]
  const info = key.toBytes32('info')

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly adds cover when accessed by whitelisted cover creator', async () => {
    const [owner] = await ethers.getSigners()

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, false, info, deployed.dai.address, requiresWhitelist, values)
    await deployed.cover.deployVault(coverKey)
  })

  it('reverts when not accessed by whitelisted cover creator', async () => {
    const [owner, bob] = await ethers.getSigners()

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.connect(bob).addCover(coverKey, false, info, deployed.dai.address, requiresWhitelist, values)
      .should.be.rejectedWith('Not whitelisted')
  })

  it('reverts when invalid value is passed as reassuranceToken', async () => {
    const [owner] = await ethers.getSigners()

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, false, info, deployed.npm.address, requiresWhitelist, values)
      .should.be.rejectedWith('Invalid reassurance token')
  })

  it('reverts when stake amount is less NS_COVER_CREATION_MIN_STAKE', async () => {
    const [owner] = await ethers.getSigners()

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    const v = [helper.ether(1), initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, '1']
    await deployed.cover.addCover(coverKey, false, info, deployed.dai.address, requiresWhitelist, v)
      .should.be.rejectedWith('Your stake is too low')
  })
})
