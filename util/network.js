const hre = require('hardhat')
const network = require('../scripts/config/network')

const getNetworkInfo = async () => {
  return network[hre.network.config.chainId]
}

module.exports = { getNetworkInfo }
