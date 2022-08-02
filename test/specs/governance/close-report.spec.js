/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../util')
const composer = require('../../../util/composer')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Governance: closeReport', () => {
  let deployed, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const initialLiquidity = helper.ether(4_000_000, PRECISION)
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

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)

    deployed.vault = await composer.vault.getVault({
      store: deployed.store,
      libs: {
        accessControlLibV1: deployed.accessControlLibV1,
        baseLibV1: deployed.baseLibV1,
        transferLib: deployed.transferLib,
        protoUtilV1: deployed.protoUtilV1,
        registryLibV1: deployed.registryLibV1,
        validationLibV1: deployed.validationLibV1
      }
    }, coverKey)

    await deployed.dai.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minReportingStake)
    await deployed.vault.addLiquidity(coverKey, initialLiquidity, minReportingStake, key.toBytes32(''))
  })

  it('must close the report correctly', async () => {
    const [owner, bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))
    const amount = helper.ether(1000)

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, amount)
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, amount)

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.add(amount, 1))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.add(amount, 1))

    await network.provider.send('evm_increaseTime', [1])
    const tx = await deployed.resolution.closeReport(coverKey, helper.emptyBytes32, incidentDate)

    const { events } = await tx.wait()

    let event = events.find(x => x.event === 'Resolved')
    event.args.coverKey.should.equal(coverKey)
    event.args.incidentDate.should.equal(incidentDate)
    event.args.emergency.should.equal(true)
    event.args.decision.should.equal(false)

    event = events.find(x => x.event === 'Finalized')
    event.args.coverKey.should.equal(coverKey)
    event.args.incidentDate.should.equal(incidentDate)

    event = events.find(x => x.event === 'ReportClosed')
    event.args.coverKey.should.equal(coverKey)
    event.args.productKey.should.equal(helper.emptyBytes32)
    event.args.closedBy.should.equal(owner.address)
    event.args.incidentDate.should.equal(incidentDate)
  })

  it('revert when the status is not false reporting', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))
    const amount = helper.ether(1000)

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, amount)
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, amount)

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, amount)
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, amount)

    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.closeReport(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Not disputed')

    await deployed.npm.connect(bob).approve(deployed.governance.address, 1)
    await deployed.governance.connect(bob).refute(coverKey, helper.emptyBytes32, incidentDate, 1)
    await deployed.resolution.closeReport(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('revert when accessed after reporting period', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))
    const amount = helper.ether(1000)

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, amount)
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, amount)

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.add(amount, 1))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.add(amount, 1))

    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.closeReport(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Reporting window closed')

    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when invalid incident date is specified', async () => {
    await deployed.resolution.closeReport(coverKey, helper.emptyBytes32, 0)
      .should.be.rejectedWith('Please specify incident date')
  })
})
