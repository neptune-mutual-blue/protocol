const hardhat = require('./hardhat-fork')
const mainnet = require('./mainnet')
const arbitrum = require('./arbitrum')
const fuji = require('./fuji')
const local = require('./local')

module.exports = {
  ...hardhat,
  ...fuji,
  ...mainnet,
  ...arbitrum,
  ...local
}
