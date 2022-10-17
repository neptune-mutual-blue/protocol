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
      gasPrice: 50 * GWEI,
      blockGasLimit: 20000000 // 20M
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY],
      gas: 'auto',
      explorer: 'https://mumbai.polygonscan.com'
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY],
      gas: 'auto',
      explorer: 'https://testnet.snowtrace.io'
    },
    local: {
      url: 'http://localhost:8545/',
      chainId: 1337,
      accounts: [process.env.PRIVATE_KEY]
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
    apiKey: process.env.SNOWTRACE_API_KEY,
    apiKeyAll: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      mumbai: process.env.POLYGONSCAN_API_KEY,
      fuji: process.env.SNOWTRACE_API_KEY
    }
  },
  paths: {
    tests: './test',
    sources: './contracts',
    cache: './cache_hardhat',
    artifacts: './artifacts'
  }
}

module.exports = config
