/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const moment = require('moment')
const { helper, deployer, key } = require('../../../util')
const { getCoverFee } = require('./util/calculator')
const composer = require('../../../util/composer')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400
const MULTIPLIER = 10_000
const INCIDENT_SUPPORT_POOL_CAP_RATIO = MULTIPLIER

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const amounts = [1, 5, 10, 15, 20, 50, 100, 150, 200, 500, 1000, 1500, 2000, 5000, 10_000, 15_000, 20_000, 50_000, 100_000, 150_000, 200_000, 500_000, 1_000_000, 1_250_000, 1_500_000, 1_750_000, 2_000_000, 2_250_000, 2_500_000, 2_750_000, 3_000_000, 3_500_000, 4_000_000, 5_000_000, 10_000_000]
const durations = [1, 2, 3]

const data = {
  reassuranceAmount: 1_000_000,
  inVault: 14_000_000,
  totalCommitment: 0,
  floor: 0.07,
  ceiling: 0.45,
  MULTIPLIER,
  INCIDENT_SUPPORT_POOL_CAP_RATIO
}

const payload = {
  reassuranceAmount: ethers.BigNumber.from(helper.ether(data.reassuranceAmount)),
  inVault: ethers.BigNumber.from(helper.ether(data.inVault)),
  totalCommitment: ethers.BigNumber.from(helper.ether(data.totalCommitment)),
  floor: ethers.BigNumber.from(helper.percentage(7)),
  ceiling: ethers.BigNumber.from(helper.percentage(45)),
  reassuranceRate: helper.percentage(50),
  MULTIPLIER,
  INCIDENT_SUPPORT_POOL_CAP_RATIO
}

const getFee = (amount, duration, days) => getCoverFee(data, amount, duration, days, false)

const getDaysCovered = (startTimestamp, duration) => {
  const monthToAdd = moment.unix(startTimestamp).utc(false).date() >= 25 ? duration : duration - 1
  return moment.unix(startTimestamp).utc(false).add(monthToAdd, 'months').endOf('month').diff(moment.unix(startTimestamp), 'days')
}

describe('Policy: getCoverFeeInfo', () => {
  let deployed, coverKey, startTimestamp

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
    const minReportingStake = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const leverage = '1'

    const requiresWhitelist = false
    const values = [stakeWithFee, payload.reassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, payload.floor, payload.ceiling, payload.reassuranceRate, leverage]

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, payload.reassuranceAmount)

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

    await deployed.dai.approve(deployed.vault.address, payload.inVault)
    await deployed.npm.approve(deployed.vault.address, minReportingStake)
    await deployed.vault.addLiquidity(coverKey, payload.inVault, minReportingStake, key.toBytes32(''))

    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    startTimestamp = block.timestamp
  })

  it('must return correct fee', async function () {
    this.timeout(60 * 1000)

    for (const amount of amounts) {
      for (const duration of durations) {
        const days = getDaysCovered(startTimestamp, duration)
        const expected = helper.formatCurrency(getFee(amount, duration, days), 4).trim()

        console.info(`Expected ${expected} to cover ${helper.formatCurrency(amount, 0)} for ${duration} month(s). Days: ${days}`)
        const fees = await deployed.policy.getCoverFeeInfo(coverKey, helper.emptyBytes32, duration.toString(), helper.ether(amount))

        expected.should.equal(helper.formatCurrency(helper.weiToEther(fees), 4))
      }
    }
  })

  it('must revert if zero is specified as the amount to cover', async () => {
    await deployed.policy.getCoverFeeInfo(coverKey, helper.emptyBytes32, '1', helper.ether(0))
      .should.be.rejectedWith('Please enter an amount')
  })

  it('must revert if invalid value is specified as the cover duration', async () => {
    await deployed.policy.getCoverFeeInfo(coverKey, helper.emptyBytes32, '0', helper.ether(10000))
      .should.be.rejectedWith('Invalid duration')
  })
})
