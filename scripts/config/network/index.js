const hardhat = require('./hardhat')
const mainnet = require('./mainnet')
const fuji = require('./fuji')
const mumbai = require('./mumbai')
const local = require('./local')

module.exports = {
  ...hardhat,
  ...fuji,
  ...mumbai,
  ...mainnet,
  ...local
}
