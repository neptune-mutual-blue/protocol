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
      blockGasLimit: 19000000,
      chainId: 31338
    },
    local: {
      // npx hardhat node --port 7547 --fork https://bsc-dataseed.binance.org
      chainId: 31337,
      url: 'http://localhost:7547',
      gasPrice: 3 * GWEI,
      blockGasLimit: 20000000, // 20M
      explorer: 'https://bscscan.com'
    },
    basegoerli: {
      url: 'https://goerli.base.org',
      chainId: 84531,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1 * GWEI,
      explorer: 'https://goerli.basescan.org'
    },
    fuji: {
      url: 'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc',
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 33 * GWEI,
      explorer: 'https://testnet.snowtrace.io'
    },
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 10 * GWEI,
      explorer: 'https://testnet.bscscan.com/'
    },
    polygonMumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 2 * GWEI,
      explorer: 'https://mumbai.polygonscan.com/'
    },
    ethereum: {
      blockGasLimit: 19000000, // 19M
      url: process.env.ETHEREUM_RPC_URL,
      chainId: 1,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 80 * GWEI,
      explorer: 'https://etherscan.io'
    },
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL,
      chainId: 42161,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 0.1 * GWEI,
      explorer: 'https://arbiscan.io'
    },
    bsc: {
      url: process.env.BSC_RPC_URL,
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 3 * GWEI,
      explorer: 'https://bscscan.com'
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
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
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
