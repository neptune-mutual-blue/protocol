require('hardhat-contract-sizer')
require('@nomiclabs/hardhat-waffle')
require('solidity-coverage')
require('hardhat-gas-reporter')
require('@nomiclabs/hardhat-etherscan')
require('dotenv').config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    ropsten: {
      url: 'https://ropsten.infura.io/v3/04f673a8619b4e3f89a49232d453f6f2',
      chainId: 3,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 30000000000,
      gas: 'auto'
    },
    bsctestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 30000000000,
      gas: 'auto'
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 30000000000,
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
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false
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
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}
