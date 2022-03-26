const hardhat = require('./hardhat')
const mainnet = require('./mainnet')
const ropsten = require('./ropsten')
const mumbai = require('./mumbai')

module.exports = {
  ...hardhat,
  ...ropsten,
  ...mumbai,
  ...mainnet
}
