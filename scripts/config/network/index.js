const hardhat = require('./hardhat')
const mainnet = require('./mainnet')
const arbitrum = require('./arbitrum')
const baseGoerli = require('./base-goerli')
const local = require('./local')

module.exports = {
  ...hardhat,
  ...baseGoerli,
  ...mainnet,
  ...arbitrum,
  ...local
}
