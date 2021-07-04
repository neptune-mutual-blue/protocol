const ethers = require('ethers')
const crypto = require('crypto')
const BigNumber = require('bignumber.js')

BigNumber.config({ EXPONENTIAL_AT: 99 })

const randomPrivateKey = () => `0x${crypto.randomBytes(32).toString('hex')}`
const randomAddress = () => new ethers.Wallet(randomPrivateKey()).address
const bn = (x) => BigNumber(x.toString()).toString()
const ether = (x) => BigNumber((parseFloat(x.toString()) * 10 ** 18).toString()).toString()
const weiToEther = (x) => parseInt(x.toString()) / 10 ** 18
const add = (x, y) => BigNumber(x.toString()).plus(y.toString()).toString()
const zerox = '0x0000000000000000000000000000000000000000'
const zero1 = '0x0000000000000000000000000000000000000001'

// for (let i = 0; i < 20; i++) {
//   console.log(randomAddress())
// }

module.exports = {
  randomAddress,
  randomPrivateKey,
  ether,
  weiToEther,
  bn,
  add,
  zerox,
  zero1
}
