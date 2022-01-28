require('hardhat-contract-sizer')
require('@nomiclabs/hardhat-waffle')
require('solidity-coverage')
require('hardhat-gas-reporter')
require('@nomiclabs/hardhat-etherscan')
require('dotenv').config()

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
    },
    ropsten: {
      url: `${process.env.ROPSTEN_RPC_URL}`,
      chainId: 3,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 60000000000,
      gas: 'auto'
    },
    kovan: {
      url: `${process.env.KOVAN_RPC_URL}`,
      chainId: 42,
      accounts: [process.env.PRIVATE_KEY],
      // gasPrice: 60000000000,
      gas: 'auto'
    },
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY],
      // gasPrice: 30000000000,
      gas: 'auto'
    },
    polygonMumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY],
      // gasPrice: 30000000000,
      gas: 'auto'
    },
    local: {
      url: 'http://localhost:8545/',
      chainId: 1337,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: '0.8.0',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
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
    apiKey: process.env.ETHERSCAN_API_KEY,
    apiKeyAll: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      ropsten: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      mumbai: process.env.POLYGONSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY
    }
  }
}

module.exports = config
