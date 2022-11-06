const config = require('./mainnet')

config[31337] = config[1]
config[31337].network = 'Hardhat Forked Ethereum Network'
config[31337].mainnet = false

module.exports = config
