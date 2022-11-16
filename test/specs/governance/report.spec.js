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

describe('Governance: report', () => {
  let deployed, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const initialLiquidity = helper.ether(4_000_000, PRECISION)
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

    await deployed.stablecoin.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minStakeToReport)
    await deployed.vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
  })

  it('must report correctly', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(20000))
    const amount = helper.ether(10000)

    const reportingInfo = key.toBytes32('reporting-info')

    await deployed.npm.connect(bob).approve(deployed.governance.address, amount)
    const tx = await deployed.governance.connect(bob).report(coverKey, helper.emptyBytes32, reportingInfo, amount)
    const { events } = await tx.wait()

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)
    const attestedEvent = events.find(x => x.event === 'Attested')
    attestedEvent.args.coverKey.should.equal(coverKey)
    attestedEvent.args.incidentDate.should.equal(incidentDate)
    attestedEvent.args.witness.should.equal(bob.address)
    attestedEvent.args.stake.should.equal(amount)

    const reportedEvent = events.find(x => x.event === 'Reported')
    reportedEvent.args.coverKey.should.equal(coverKey)
    reportedEvent.args.reporter.should.equal(bob.address)
    reportedEvent.args.incidentDate.should.equal(incidentDate)
    reportedEvent.args.info.should.equal(reportingInfo)
    reportedEvent.args.initialStake.should.equal(amount)

    const [myStake, totalStake] = await deployed.governance.getAttestation(coverKey, helper.emptyBytes32, bob.address, incidentDate)

    myStake.should.equal(amount)
    totalStake.should.equal(amount)

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

  it('reverts when tried to report twice', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))
      .should.be.rejectedWith('Status not normal')

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

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

  it('reverts when invalid value is passed as stake', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(0))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(0))
      .should.be.rejectedWith('Stake insufficient')
  })

  it('reverts when the value passed as stake is less than the minimum reporting stake', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(25))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(25))
      .should.be.rejectedWith('Stake insufficient')
  })
})
