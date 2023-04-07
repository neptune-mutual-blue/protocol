const mainnet = require('./mainnet')

const config = {}
config[31337] = { ...mainnet[1] }
config[31337].network = 'Hardhat Forked Ethereum Network'
config[31337].mainnet = false
config[31337].chainId = 31337

module.exports = config
