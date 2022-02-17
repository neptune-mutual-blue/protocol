const ethers = require('ethers')
const crypto = require('crypto')
const BigNumber = require('bignumber.js')

BigNumber.config({ EXPONENTIAL_AT: 99 })

const MULTIPLIER = 10_000

const randomPrivateKey = () => `0x${crypto.randomBytes(32).toString('hex')}`
const randomAddress = () => new ethers.Wallet(randomPrivateKey()).address
const bn = (x) => BigNumber(x.toString()).toString()
const ether = (x) => BigNumber((parseFloat(x.toString()) * 10 ** 18).toString()).toString()
const percentage = (x) => BigNumber((x * MULTIPLIER).toString()).dividedBy(100).toString()
const weiToEther = (x) => parseInt(x.toString()) / 10 ** 18
const toPercentageString = (x) => (100 * parseInt(x.toString()) / MULTIPLIER).toFixed(2)
const add = (x, y) => BigNumber(x.toString()).plus(y.toString()).toString()
const zerox = '0x0000000000000000000000000000000000000000'
const zero1 = '0x0000000000000000000000000000000000000001'
const sum = (x) => x.reduce((y, z) => y + z)
const getRandomNumber = (min, max) => Math.ceil(Math.floor(Math.random() * (max - min + 1)) + min)
const formatToken = (x, symbol) => Number(x).toLocaleString(undefined, { minimumFractionDigits: 2 }) + (` ${symbol}` || '')
const weiAsToken = (x, symbol) => formatToken(weiToEther(x), symbol)

const coverStatus = {
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
  coverStatus,
  sum,
  getRandomNumber,
  weiAsToken
}
