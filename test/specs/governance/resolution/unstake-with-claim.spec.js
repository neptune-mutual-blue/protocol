/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Resolution: unstakeWithClaim (incident occurred)', () => {
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
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

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

  it('must unstake and claim rewards correctly', async () => {
    const [owner, bob] = await ethers.getSigners()

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.transfer(bob.address, helper.ether(1000))
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(1000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    const tx = await deployed.resolution.unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
    const { events } = await tx.wait()

    const unstakenEvent = events.find(x => x.event === 'Unstaken')
    unstakenEvent.args.caller.should.equal(owner.address)
    unstakenEvent.args.originalStake.should.equal(helper.ether(1000))
    unstakenEvent.args.reward.should.equal(helper.ether(600))

    const reporterRewardDistributedEvent = events.find(x => x.event === 'ReporterRewardDistributed')
    reporterRewardDistributedEvent.args.caller.should.equal(owner.address)
    reporterRewardDistributedEvent.args.reporter.should.equal(owner.address)
    reporterRewardDistributedEvent.args.originalReward.should.equal(helper.ether(600))
    reporterRewardDistributedEvent.args.reporterReward.should.equal(helper.ether(100))

    const governanceBurnedEvent = events.find(x => x.event === 'GovernanceBurned')
    governanceBurnedEvent.args.caller.should.equal(owner.address)
    governanceBurnedEvent.args.burner.should.equal(helper.zero1)
    governanceBurnedEvent.args.originalReward.should.equal(helper.ether(600))
    governanceBurnedEvent.args.burnedAmount.should.equal(helper.ether(300))

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('must unstake and claim rewards correctly when no dispute exists', async () => {
    const [owner] = await ethers.getSigners()

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    const tx = await deployed.resolution.unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
    const { events } = await tx.wait()

    const unstakenEvent = events.find(x => x.event === 'Unstaken')
    unstakenEvent.args.caller.should.equal(owner.address)
    unstakenEvent.args.originalStake.should.equal(helper.ether(1000))
    unstakenEvent.args.reward.should.equal(helper.ether(0))

    const reporterRewardDistributedEvent = events.find(x => x.event === 'ReporterRewardDistributed')
    reporterRewardDistributedEvent.args.caller.should.equal(owner.address)
    reporterRewardDistributedEvent.args.reporter.should.equal(owner.address)
    reporterRewardDistributedEvent.args.originalReward.should.equal(helper.ether(0))
    reporterRewardDistributedEvent.args.reporterReward.should.equal(helper.ether(0))

    const governanceBurnedEvent = events.find(x => x.event === 'GovernanceBurned')
    governanceBurnedEvent.args.caller.should.equal(owner.address)
    governanceBurnedEvent.args.burner.should.equal(helper.zero1)
    governanceBurnedEvent.args.originalReward.should.equal(helper.ether(0))
    governanceBurnedEvent.args.burnedAmount.should.equal(helper.ether(0))

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('must reverts when accessed after claim period', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.unstake(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Incident not finalized')
    await deployed.resolution.unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Claim period has expired')

    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when accessed before resolved', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Still unresolved')

    // Clean up - Resolve and finalize
    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when accessed after resolved and before emergency resolution deadline', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    await deployed.resolution.unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Still unresolved')

    // Clean up - finalize
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when invalid value is passed as incident date', async () => {
    await deployed.resolution.unstakeWithClaim(coverKey, helper.emptyBytes32, 0).should.be.rejectedWith('Please specify incident date')
  })

  it('reverts when protocol is paused', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    await deployed.protocol.pause()
    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)
    await deployed.resolution.unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate).should.be.rejectedWith('Protocol is paused')

    // Clean up - Unpause, Resolve and finalize
    await deployed.protocol.unpause()
    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when already unstaken', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
    await deployed.resolution.unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Already unstaken')

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })
})

describe('Resolution: unstakeWithClaim (false reporting)', () => {
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
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

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

  it('must unstake and claim rewards correctly', async () => {
    const [, bob] = await ethers.getSigners()

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.transfer(bob.address, helper.ether(5000))
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(5000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(5000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    const tx = await deployed.resolution.connect(bob).unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
    const { events } = await tx.wait()

    const unstakenEvent = events.find(x => x.event === 'Unstaken')
    unstakenEvent.args.caller.should.equal(bob.address)
    unstakenEvent.args.originalStake.should.equal(helper.ether(5000))
    unstakenEvent.args.reward.should.equal(helper.ether(600))

    const reporterRewardDistributedEvent = events.find(x => x.event === 'ReporterRewardDistributed')
    reporterRewardDistributedEvent.args.caller.should.equal(bob.address)
    reporterRewardDistributedEvent.args.reporter.should.equal(bob.address)
    reporterRewardDistributedEvent.args.originalReward.should.equal(helper.ether(600))
    reporterRewardDistributedEvent.args.reporterReward.should.equal(helper.ether(100))

    const governanceBurnedEvent = events.find(x => x.event === 'GovernanceBurned')
    governanceBurnedEvent.args.caller.should.equal(bob.address)
    governanceBurnedEvent.args.burner.should.equal(helper.zero1)
    governanceBurnedEvent.args.originalReward.should.equal(helper.ether(600))
    governanceBurnedEvent.args.burnedAmount.should.equal(helper.ether(300))

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('must unstake and claim even after claim period', async () => {
    const [, bob] = await ethers.getSigners()

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.transfer(bob.address, helper.ether(5000))
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(5000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(5000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    const tx = await deployed.resolution.connect(bob).unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
    const { events } = await tx.wait()

    const unstakenEvent = events.find(x => x.event === 'Unstaken')
    unstakenEvent.args.caller.should.equal(bob.address)
    unstakenEvent.args.originalStake.should.equal(helper.ether(5000))
    unstakenEvent.args.reward.should.equal(helper.ether(600))

    const reporterRewardDistributedEvent = events.find(x => x.event === 'ReporterRewardDistributed')
    reporterRewardDistributedEvent.args.caller.should.equal(bob.address)
    reporterRewardDistributedEvent.args.reporter.should.equal(bob.address)
    reporterRewardDistributedEvent.args.originalReward.should.equal(helper.ether(600))
    reporterRewardDistributedEvent.args.reporterReward.should.equal(helper.ether(100))

    const governanceBurnedEvent = events.find(x => x.event === 'GovernanceBurned')
    governanceBurnedEvent.args.caller.should.equal(bob.address)
    governanceBurnedEvent.args.burner.should.equal(helper.zero1)
    governanceBurnedEvent.args.originalReward.should.equal(helper.ether(600))
    governanceBurnedEvent.args.burnedAmount.should.equal(helper.ether(300))

    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when accessed before resolved', async () => {
    const [, bob] = await ethers.getSigners()

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.transfer(bob.address, helper.ether(5000))
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(5000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(5000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.connect(bob).unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Still unresolved')
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when accessed after resolved and before emergency resolve deadline', async () => {
    const [, bob] = await ethers.getSigners()

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.transfer(bob.address, helper.ether(5000))
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(5000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(5000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    await deployed.resolution.connect(bob).unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Still unresolved')

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when already unstaken', async () => {
    const [, bob] = await ethers.getSigners()

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.transfer(bob.address, helper.ether(5000))
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(5000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(5000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.connect(bob).unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
    await deployed.resolution.connect(bob).unstakeWithClaim(coverKey, helper.emptyBytes32, incidentDate)
      .should.be.rejectedWith('Already unstaken')

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })
})
