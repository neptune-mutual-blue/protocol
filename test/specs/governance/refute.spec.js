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

describe('Governance: refute', () => {
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

  it('must refute correctly', async () => {
    const [bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(1000))

    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    const tx = await deployed.governance.connect(bob).refute(coverKey, helper.emptyBytes32, incidentDate, helper.ether(1000))
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'Refuted')

    event.args.coverKey.should.equal(coverKey)
    event.args.incidentDate.should.equal(incidentDate)
    event.args.witness.should.equal(bob.address)
    event.args.stake.should.equal(helper.ether(1000))

    // Cleanup - resolve, finalize
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

  it('reverts when tried to refute after reporting period', async () => {
    const [bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(1000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).refute(coverKey, helper.emptyBytes32, incidentDate, helper.ether(1000))
      .should.be.rejectedWith('Reporting window closed')

    // Cleanup - resolve, finalize
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when tried to refute after resolved', async () => {
    const [bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(1000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).refute(coverKey, helper.emptyBytes32, incidentDate, helper.ether(1000))
      .should.be.rejectedWith('Reporting window closed')

    // Cleanup - finalize
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('reverts when invalid value is passed as stake', async () => {
    const [bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, helper.ether(1000))

    await deployed.npm.connect(bob).approve(deployed.governance.address, helper.ether(0))
    await deployed.governance.connect(bob).refute(coverKey, helper.emptyBytes32, incidentDate, helper.ether(0))
      .should.be.rejectedWith('Enter a stake')

    // Cleanup - resolve, finalize
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
})
