require('hardhat-contract-sizer')
require('@nomiclabs/hardhat-waffle')
require('solidity-coverage')
require('hardhat-gas-reporter')
require('@nomiclabs/hardhat-etherscan')
require('dotenv').config()

const GWEI = 1000000000

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      // forking: {
      //   url: process.env.ALCHEMY_API_URL,
      //   blockNumber: 11819774
      // }
      explorer: 'https://fooscan.com'
    },
    local: {
      url: 'http://localhost:8545/',
      chainId: 1337,
      accounts: [process.env.PRIVATE_KEY]
    },
    basegoerli: {
      url: 'https://goerli.base.org',
      chainId: 84531,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1 * GWEI,
      explorer: 'https://goerli.basescan.org'
    }
  },
  solidity: {
    version: '0.6.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 999_999
      }
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  mocha: {
    timeout: 20000
  },
  gasReporter: {
    currency: 'ETH',
    gasPrice: 21
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      basegoerli: 'base'
    },
    customChains: [
      {
        network: 'basegoerli',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org'
        }
      }
    ]
  }
}

module.exports = config
