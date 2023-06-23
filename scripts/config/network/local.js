const mainnet = require('./bsc')

const config = {}
config[31337] = { ...mainnet[56] }
config[31337].network = 'Hardhat Forked BNB Chain Network'
config[31337].mainnet = true
config[31337].chainId = 31337

module.exports = config
