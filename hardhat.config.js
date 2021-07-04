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
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      chainId: 80001,
      gasPrice: 20000000000,
      accounts: { mnemonic: process.env.MUMBAI_MNEMONIC }
    }
  },
  solidity: '0.8.4',
  settings: {
    optimizer: {
      enabled: true,
      runs: 999999
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
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
}
