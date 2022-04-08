/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Resolution: unstakeWithClaim', () => {
  let deployed, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    deployed.policy = await deployer.deployWithLibraries(cache, 'Policy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      CoverUtilV1: deployed.coverUtilV1.address,
      PolicyHelperV1: deployed.policyHelperV1.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY, deployed.policy.address)

    coverKey = key.toBytes32('foo-bar')
    const stakeWithFee = helper.ether(10_000)
    const initialReassuranceAmount = helper.ether(1_000_000)
    const initialLiquidity = helper.ether(4_000_000)
    const minReportingStake = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)

    const requiresWhitelist = false
    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling]

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, deployed.dai.address, requiresWhitelist, values)
    await deployed.cover.deployVault(coverKey)

    deployed.vault = await composer.vault.getVault({
      store: deployed.store,
      libs: {
        accessControlLibV1: deployed.accessControlLibV1,
        baseLibV1: deployed.baseLibV1,
        transferLib: deployed.transferLib,
        protoUtilV1: deployed.protoUtilV1,
        registryLibV1: deployed.registryLibV1,
        validationLib: deployed.validationLibV1
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
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.transfer(bob.address, helper.ether(1000))
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, incidentDate, disputeInfo, helper.ether(1000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    const tx = await deployed.resolution.unstakeWithClaim(coverKey, incidentDate)
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
    await deployed.resolution.finalize(coverKey, incidentDate)
  })

  it('must unstake and claim rewards correctly when no dispute exists', async () => {
    const [owner] = await ethers.getSigners()

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    const tx = await deployed.resolution.unstakeWithClaim(coverKey, incidentDate)
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
    await deployed.resolution.finalize(coverKey, incidentDate)
  })

  it('must reverts when accessed after claim period', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.unstakeWithClaim(coverKey, incidentDate)
      .should.be.rejectedWith('Claim period has expired')

    await deployed.resolution.finalize(coverKey, incidentDate)
  })

  it('reverts when accessed before resolved', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.unstakeWithClaim(coverKey, incidentDate)
      .should.be.rejectedWith('Still unresolved')

    // Clean up - Resolve and finalize
    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, incidentDate)
  })

  it('reverts when accessed after resolved and before emergency resolution deadline', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, incidentDate)

    await deployed.resolution.unstakeWithClaim(coverKey, incidentDate)
      .should.be.rejectedWith('Still unresolved')

    // Clean up - finalize
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, incidentDate)
  })

  it('reverts when invalid value is passed as incident date', async () => {
    await deployed.resolution.unstakeWithClaim(coverKey, 0).should.be.rejectedWith('Please specify incident date')
  })

  it('reverts when protocol is paused', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    await deployed.protocol.pause()
    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)
    await deployed.resolution.unstakeWithClaim(coverKey, incidentDate).should.be.rejectedWith('Protocol is paused')

    // Clean up - Unpause, Resolve and finalize
    await deployed.protocol.unpause()
    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, incidentDate)
  })

  it('reverts when already unstaken', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.resolution.unstakeWithClaim(coverKey, incidentDate)
    await deployed.resolution.unstakeWithClaim(coverKey, incidentDate)
      .should.be.rejectedWith('Already unstaken')

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, incidentDate)
  })
})
