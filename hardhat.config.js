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
      blockGasLimit: 19000000
    },
    local: {
      chainId: 1337,
      url: 'http://localhost:7547',
      gasPrice: 12 * GWEI,
      blockGasLimit: 20000000, // 20M
      explorer: 'https://etherscan.com'
    },
    basegoerli: {
      url: 'https://goerli.base.org',
      chainId: 84531,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1 * GWEI,
      explorer: 'https://goerli.basescan.org'
    },
    ethereum: {
      blockGasLimit: 19000000, // 19M
      url: process.env.ETHEREUM_RPC_URL,
      chainId: 1,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 14 * GWEI,
      explorer: 'https://etherscan.io'
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL,
      chainId: 42161,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 0.1 * GWEI,
      explorer: 'https://arbiscan.io'
    }
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 999_999
      }
    }
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
  },
  paths: {
    tests: './test',
    sources: './contracts',
    cache: './cache_hardhat',
    artifacts: './artifacts'
  }
}

module.exports = config
