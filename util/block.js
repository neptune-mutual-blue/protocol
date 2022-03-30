const hre = require('hardhat')
const moment = require('moment')

const getTimestamp = async () => {
  const { timestamp } = await hre.ethers.provider.getBlock('latest')
  return moment.unix(timestamp)
}

const mineBlocks = async (totalBlocks) => {
  while (totalBlocks > 0) {
    totalBlocks--
    await hre.network.provider.request({
      method: 'evm_mine',
      params: []
    })
  }
}

module.exports = { getTimestamp, mineBlocks }
