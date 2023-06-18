const hardhat = require('./hardhat')
const mainnet = require('./mainnet')
const arbitrum = require('./arbitrum')
const bsc = require('./bsc')
const baseGoerli = require('./base-goerli')
const local = require('./local')

module.exports = {
  ...hardhat,
  ...baseGoerli,
  ...mainnet,
  ...arbitrum,
  ...bsc,
  ...local
}
