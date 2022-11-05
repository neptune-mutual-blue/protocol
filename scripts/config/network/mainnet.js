const { ACCESS_CONTROL } = require('../../../util/key')

const MINUTES = 60
const DAYS = 86400

const config = {
  1: {
    network: 'Main Ethereum Network',
    chainId: 1,
    mainnet: true,
    pool: {
      bond: {
        period: 7 * DAYS
      }
    },
    cover: {
      lendingPeriod: 180 * DAYS,
      withdrawalWindow: 7 * DAYS,
      claimPeriod: 7 * DAYS,
      cooldownPeriod: 1 * DAYS,
      reportingPeriod: 7 * DAYS,
      stateUpdateInterval: 5 * MINUTES
    },
    knownAccounts: [

    ],
    deployedTokens: {
      NPM: '0xb31AB812aAD7E905A7B8f3263560D2f610d582d7', // POT
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    },
    uniswapV2Like: {
      description: 'Uniswap on Ethereum',
      addresses: {
        factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        npmPriceOracle: null
      }
    },
    aave: {
      description: 'Aave on Ethereum',
      addresses: {
        lendingPool: ''
      }
    },
    compound: {
      stablecoin: {
        delegator: ''
      }
    },
    protocol: {
      burner: '0x365673739e2d8F46DCCce07866e9f53A19526918',
      treasury: '0x5e4B7212Beb8926fc925328e890dBe6c6fC971f0'
    }
  }
}

module.exports = config
