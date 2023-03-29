require('@matterlabs/hardhat-zksync-deploy')
require('@matterlabs/hardhat-zksync-solc')
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
  zksolc: {
    version: '1.3.5',
    compilerSource: 'binary',
    settings: {}
  },
  networks: {
    hardhat: {
      zksync: true
    },
    local: {
      chainId: 1337,
      url: 'http://localhost:7547',
      gasPrice: 12 * GWEI,
      blockGasLimit: 20000000, // 20M
      explorer: 'https://etherscan.com'
    },
    zkTestnet: {
      url: 'https://zksync2-testnet.zksync.dev', // URL of the zkSync network RPC
      ethNetwork: 'goerli', // Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY],
      gas: 'auto',
      explorer: 'https://testnet.snowtrace.io'
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY],
      gas: 'auto',
      explorer: 'https://mumbai.polygonscan.com'
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
    apiKey: process.env.ETHERSCAN_API_KEY,
    apiKeyAll: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      arbitrum: process.env.ARBISCAN_API_KEY,
      fuji: process.env.SNOWTRACE_API_KEY,
      mumbai: process.env.POLYGONSCAN_API_KEY
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
