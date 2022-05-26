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
      gasPrice: 15000000000,
      gas: 'auto'
    },
    bscTestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY],
      // gasPrice: 30000000000,
      gas: 'auto'
    },
    mumbai: {
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
  solidity: {
    version: '0.6.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 999_999
      }
    }
  }
}

module.exports = config
