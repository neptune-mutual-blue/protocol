/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Governance: `setFirstReportingStake` function', () => {
  const amount = '10000'
  const minReportingStake = helper.ether(250)
  let coverKey, deployed

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const stakeWithFee = helper.ether(10_000)

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

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)
  })

  it('must set first reporting stake ', async () => {
    await deployed.governance.setFirstReportingStake(helper.emptyBytes32, amount)
    await deployed.governance.setFirstReportingStake(coverKey, minReportingStake)
  })

  it('must get first reporting stake ', async () => {
    const result = await deployed.governance.getFirstReportingStake(helper.emptyBytes32)
    result.should.equal(amount)
  })

  it('must get first reporting stake ', async () => {
    const result = await deployed.governance.getFirstReportingStake(coverKey)
    result.should.equal(minReportingStake)
  })

  it('reverts when zero is specified as minReportingStake', async () => {
    await deployed.governance.setFirstReportingStake(coverKey, '0').should.be.rejectedWith('Please specify value')
  })
})
