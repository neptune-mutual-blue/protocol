const { ethers } = require('ethers')
const BigNumber = require('bignumber.js')
const moment = require('moment')
const { helper } = require('../../../../util')
const { getCoverFee, getCoverFeeBn } = require('./calculator')
const MULTIPLIER = 10_000
const INCIDENT_SUPPORT_POOL_CAP_RATIO = 2500
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const data = {
  reassuranceAmount: 1_000_000,
  inVault: 24_000_000,
  totalCommitment: 0,
  floor: 0.07,
  ceiling: 0.45,
  MULTIPLIER,
  INCIDENT_SUPPORT_POOL_CAP_RATIO
}

const payload = {
  reassuranceAmount: ethers.BigNumber.from(helper.ether(data.reassuranceAmount, PRECISION)),
  inVault: ethers.BigNumber.from(helper.ether(data.inVault, PRECISION)),
  totalCommitment: ethers.BigNumber.from(helper.ether(data.totalCommitment, PRECISION)),
  floor: ethers.BigNumber.from(helper.percentage(7)),
  ceiling: ethers.BigNumber.from(helper.percentage(45)),
  MULTIPLIER,
  INCIDENT_SUPPORT_POOL_CAP_RATIO
}

const getFee = (amount, duration, days) => getCoverFee(data, amount, duration, days, false)
const getFeeBn = (amount, duration, days) => getCoverFeeBn(payload, amount, duration, days, false)
const getDaysCovered = (startedOn, duration) => startedOn.add(duration, 'months').endOf('month').diff(startedOn, 'days')

describe('Policy Fee Calculation tests', () => {
  const startedOn = moment(new Date()).utc(false)
  const amounts = [1, 5, 10, 15, 20, 50, 100, 150, 200, 500, 1000, 1500, 2000, 5000, 10_000, 15_000, 20_000, 50_000, 100_000, 150_000, 200_000, 250_000, 500_000, 1_000_000, 1_250_000, 1_500_000, 1_750_000, 2_000_000, 2_250_000, 2_500_000, 2_750_000, 3_000_000, 3_500_000, 4_000_000, 5_000_000, 10_000_000]
  const durations = [1, 2, 3]
  const cases = []

  for (const amount of amounts) {
    for (const duration of durations) {
      cases.push([amount, duration])
    }
  }

  for (const candidate of cases) {
    const [amount, duration] = candidate
    const days = getDaysCovered(startedOn, duration)

    it(`compares policy fee of ${helper.formatCurrency(amount, 0)} for ${duration} month(s)`, async () => {
      const fee = getFee(amount, duration, days)

      const amb = ethers.BigNumber.from(helper.ether(amount, PRECISION))
      const dub = ethers.BigNumber.from(duration)
      const dab = ethers.BigNumber.from(days)

      const fb = helper.weiToEther(getFeeBn(amb, dub, dab), PRECISION)

      if (duration === 2 && amount === 500_000) {
        console.info('Duration %s. Amount: %s. Fee: %s', duration, amount, fee)
      }

      helper.formatCurrency(fee).should.eq(helper.formatCurrency(fb))
    })
  }
})
