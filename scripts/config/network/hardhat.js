// const mainnet = require('./mainnet')
// const knownAccounts = mainnet['1'].knownAccounts
// const uniswapV2Like = mainnet['1'].uniswapV2Like

const config = {
  31337: {
    network: 'Hardhat Forked Ethereum Network',
    chainId: 31337,
    // knownAccounts,
    // uniswapV2Like,
    knownAccounts: null,
    uniswapV2Like: null
  }
}

module.exports = config
