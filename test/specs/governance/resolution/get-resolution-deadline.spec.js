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

describe('Resolution: getResolutionDeadline', () => {
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
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

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

    await deployed.dai.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minStakeToReport)
    await deployed.vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
  })

  it('must get resolution deadline correctly', async () => {
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)
    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Reporting period + 1 second + Cooldown period
    const result = await deployed.resolution.getResolutionDeadline(coverKey, helper.emptyBytes32)
    result.should.be.gt(parseInt(incidentDate, 10) + (7 * DAYS) + (1 * DAYS))

    // Clean up - finalize
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('must return zero if there is no active reporting', async () => {
    const result = await deployed.resolution.getResolutionDeadline(coverKey, helper.emptyBytes32)
    result.should.equal(0)
  })
})
