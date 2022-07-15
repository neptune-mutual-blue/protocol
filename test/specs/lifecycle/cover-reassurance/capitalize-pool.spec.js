/* eslint-disable no-unused-expressions */
const moment = require('moment')
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const cxTokenUtil = require('../../../../util/cxToken')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('CoverReassurance: capitalizePool', () => {
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

  it('correctly capitalizes reassurance amount', async () => {
    const [owner] = await ethers.getSigners()
    const amountToCover = helper.ether(100_000, PRECISION)

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))

    await deployed.dai.approve(deployed.policy.address, ethers.constants.MaxUint256)
    await deployed.policy.purchaseCover(owner.address, coverKey, helper.emptyBytes32, '1', amountToCover, key.toBytes32(''))
    const at = (await deployed.policy.getCxToken(coverKey, helper.emptyBytes32, '1')).cxToken

    const cxToken = await cxTokenUtil.atAddress(at, deployed)

    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    const tomorrowEOD = moment((block.timestamp + 1 * DAYS) * 1000).utc().endOf('day').unix()
    const coverageLagPeriod = tomorrowEOD - block.timestamp

    // Coverage lag + 1 second
    await network.provider.send('evm_increaseTime', [coverageLagPeriod])
    await network.provider.send('evm_increaseTime', [1])

    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))
    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    const claimAmount = helper.ether(100_000)
    await cxToken.approve(deployed.claimsProcessor.address, claimAmount)
    await deployed.claimsProcessor.claim(cxToken.address, coverKey, helper.emptyBytes32, incidentDate, claimAmount)

    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    const tx = await deployed.reassuranceContract.capitalizePool(coverKey, helper.emptyBytes32, incidentDate)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'PoolCapitalized')

    event.args.coverKey.should.equal(coverKey)
    event.args.incidentDate.should.equal(incidentDate)
    event.args.productKey.should.equal(helper.emptyBytes32)
    event.args.amount.should.equal(helper.ether(50_000, PRECISION)) // based on reassuranceRate defined above

    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })
})
