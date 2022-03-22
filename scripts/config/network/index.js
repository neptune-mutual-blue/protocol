const hardhat = require('./hardhat')
const mainnet = require('./mainnet')
const ropsten = require('./ropsten')
const kovan = require('./kovan')
const mumbai = require('./mumbai')

module.exports = {
  ...hardhat,
  ...ropsten,
  ...kovan,
  ...mumbai,
  ...mainnet
}
