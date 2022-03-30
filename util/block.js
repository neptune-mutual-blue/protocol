const hre = require('hardhat')
const moment = require('moment')

const getTimestamp = async () => {
  const { timestamp } = await hre.ethers.provider.getBlock('latest')
  return moment.unix(timestamp)
}

module.exports = { getTimestamp }
