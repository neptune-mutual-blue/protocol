require('dotenv').config()
const wallet = require('../../../util/wallet')

const testnetAdmins = ['0xA96813969437F3bad7B59335934aa75933670615']

const config = {
  42: {
    network: 'Ropsten Test Network',
    chainId: 3,
    knownAccounts: {
      admins: [wallet.toWalletAddress(process.env.PRIVATE_KEY), ...testnetAdmins]
    },
    deployedTokens: {
      DAI: '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD', // Aave Kovan DAI
      NPM: null,
      CPOOL: null,
      HT: null,
      OKB: null,
      AXS: null
    },
    stablecoinPairs: {
      NPM_DAI: null,
      CPOOL_DAI: null,
      HT_DAI: null,
      OKB_DAI: null,
      AXS_DAI: null
    },
    uniswapV2Like: {
      description: 'Sushiswap on Kovan',
      addresses: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
        masterChef: '0x80C7DD17B01855a6D2347444a0FCC36136a314de'
      }
    }
  }
}

module.exports = config
