const hardhat = require('./hardhat')
const ropsten = require('./ropsten')
const kovan = require('./kovan')
const mainnet = require('./mainnet')

module.exports = {
  ...hardhat,
  ...ropsten,
  ...kovan,
  ...mainnet
}
