const ethers = require('ethers')
const crypto = require('crypto')
const BigNumber = require('bignumber.js')

BigNumber.config({ EXPONENTIAL_AT: 99 })

const MULTIPLIER = 10_000
const STABLECOIN_DECIMALS = 6

const randomPrivateKey = () => `0x${crypto.randomBytes(32).toString('hex')}`
const randomAddress = () => new ethers.Wallet(randomPrivateKey()).address
const bn = (x) => BigNumber(x.toString()).toString()
const ether = (x, decimals = 18) => BigNumber((parseFloat(x.toString()) * 10 ** decimals).toString()).toString()
const percentage = (x) => BigNumber((x * MULTIPLIER).toString()).dividedBy(100).toString()
const weiToEther = (x, decimals = 18) => parseInt(x.toString()) / (10 ** decimals)
const toPercentageString = (x) => (100 * parseInt(x.toString()) / MULTIPLIER).toFixed(2)
const add = (x, y) => BigNumber(x.toString()).plus(y.toString()).toString()
const zerox = '0x0000000000000000000000000000000000000000'
const zero1 = '0x0000000000000000000000000000000000000001'
const emptyBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000'
const sum = (x) => x.reduce((y, z) => y + z)
const getRandomNumber = (min, max) => Math.ceil(Math.floor(Math.random() * (max - min + 1)) + min)
const formatToken = (x, symbol) => Number(x).toLocaleString('en-US', { minimumFractionDigits: 4 }) + (` ${symbol}` || '')
const weiAsToken = (x, symbol, decimals = 18) => formatToken(weiToEther(x, decimals), symbol)
const formatCurrency = (x, precision = 4) => Number(x).toLocaleString(undefined, { currency: 'USD', style: 'currency', minimumFractionDigits: precision })
const stringToHex = (x) => '0x' + Array.from(x).map(c => c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : encodeURIComponent(c).replace(/%/g, '').toLowerCase()).join('')

const formatPercent = (x) => {
  if (!x || isNaN(x)) {
    return ''
  }

  const percent = parseFloat(x) * 100

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: percent < 1 ? 6 : 2
  }).format(x)
}

const formatPercentBn = (x) => {
  return formatPercent(x.toNumber() / MULTIPLIER) + ' (BN)'
}

const productStatus = {
  normal: 0,
  stopped: 1, // Stopped
  incidentHappened: 2, // Reporting, incident happened
  falseReporting: 3, // Reporting, false reporting
  claimable: 4 // Claimable, claims accepted for payout
}

module.exports = {
  randomAddress,
  randomPrivateKey,
  ether,
  percentage,
  weiToEther,
  toPercentageString,
  bn,
  add,
  zerox,
  zero1,
  emptyBytes32,
  productStatus,
  sum,
  getRandomNumber,
  weiAsToken,
  formatCurrency,
  formatPercent,
  formatPercentBn,
  stringToHex,
  MULTIPLIER,
  STABLECOIN_DECIMALS
}
