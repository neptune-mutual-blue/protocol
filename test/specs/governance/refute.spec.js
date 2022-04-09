/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../util')
const composer = require('../../../util/composer')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Governance: refute', () => {
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
    }, deployed.store.address, '0')

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

  it('must refute correctly', async () => {
    const [bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, incidentDate, disputeInfo, helper.ether(1000))

    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    const tx = await deployed.governance.connect(bob).refute(coverKey, incidentDate, helper.ether(1000))
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'Refuted')

    event.args.key.should.equal(coverKey)
    event.args.incidentDate.should.equal(incidentDate)
    event.args.witness.should.equal(bob.address)
    event.args.stake.should.equal(helper.ether(1000))

    // Cleanup - resolve, finalize
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

  it('reverts when tried to refute after reporting period', async () => {
    const [bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, incidentDate, disputeInfo, helper.ether(1000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).refute(coverKey, incidentDate, helper.ether(1000))
      .should.be.rejectedWith('Reporting window closed')

    // Cleanup - resolve, finalize
    await deployed.resolution.resolve(coverKey, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, incidentDate)
  })

  it('reverts when tried to refute after resolved', async () => {
    const [bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, incidentDate, disputeInfo, helper.ether(1000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, incidentDate)

    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).refute(coverKey, incidentDate, helper.ether(1000))
      .should.be.rejectedWith('Reporting window closed')

    // Cleanup - finalize
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, incidentDate)
  })

  it('reverts when invalid value is passed as stake', async () => {
    const [bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, incidentDate, disputeInfo, helper.ether(1000))

    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(0))
    await deployed.governance.connect(bob).refute(coverKey, incidentDate, helper.ether(0))
      .should.be.rejectedWith('Enter a stake')

    // Cleanup - resolve, finalize
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
})
