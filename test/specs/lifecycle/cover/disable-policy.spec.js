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

describe('Cover: stopCover', () => {
  let deployed

  const coverKey = key.toBytes32('foo-bar')
  const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
  const stakeWithFee = helper.ether(10_000)
  const minReportingStake = helper.ether(250)
  const reportingPeriod = 7 * DAYS
  const cooldownPeriod = 1 * DAYS
  const claimPeriod = 7 * DAYS
  const floor = helper.percentage(7)
  const ceiling = helper.percentage(45)
  const reassuranceRate = helper.percentage(50)
  const leverage = '1'

  const requiresWhitelist = false
  const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]
  const info = key.toBytes32('info')

  beforeEach(async () => {
    deployed = await deployDependencies()
  })

  it('correctly stops cover', async () => {
    const [owner] = await ethers.getSigners()
    const status = true // false --> enable, true --> disable

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)

    await deployed.cover.disablePolicy(coverKey, helper.emptyBytes32, status, 'reason: testing')
  })

  it('reverts when tried to disable twice', async () => {
    const [owner] = await ethers.getSigners()
    const status = true // false --> enable, true --> disable

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)

    await deployed.cover.disablePolicy(coverKey, helper.emptyBytes32, status, 'reason: testing')
    await deployed.cover.disablePolicy(coverKey, helper.emptyBytes32, status, 'reason: testing')
      .should.be.rejectedWith('Already disabled')
  })

  it('reverts when not accessed by GovernanceAdmin', async () => {
    const [owner, bob] = await ethers.getSigners()
    const status = true // false --> enable, true --> disable

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)

    await deployed.cover.connect(bob).disablePolicy(coverKey, helper.emptyBytes32, status, 'reason: testing')
      .should.be.rejectedWith('Forbidden')
  })
})
