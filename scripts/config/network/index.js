const hardhat = require('./hardhat')
const ropsten = require('./ropsten')
const mainnet = require('./mainnet')

module.exports = {
  ...hardhat,
  ...ropsten,
  ...mainnet
}
