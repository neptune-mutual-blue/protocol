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
  const minStakeToReport = helper.ether(250)
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
    const leverageFactor = '1'

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.stablecoin.approve(deployed.cover.address, initialReassuranceAmount)

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
  })

  it('must set first reporting stake ', async () => {
    await deployed.governance.setFirstReportingStake(helper.emptyBytes32, amount)
    await deployed.governance.setFirstReportingStake(coverKey, minStakeToReport)
  })

  it('must get first reporting stake ', async () => {
    const result = await deployed.governance.getFirstReportingStake(helper.emptyBytes32)
    result.should.equal(amount)
  })

  it('must get first reporting stake ', async () => {
    const result = await deployed.governance.getFirstReportingStake(coverKey)
    result.should.equal(minStakeToReport)
  })

  it('reverts when zero is specified as minStakeToReport', async () => {
    await deployed.governance.setFirstReportingStake(coverKey, '0').should.be.rejectedWith('Please specify value')
  })
})
