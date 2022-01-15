require('dotenv').config()
const wallet = require('../../../util/wallet')

const testnetAdmins = ['0xA96813969437F3bad7B59335934aa75933670615']

const config = {
  3: {
    network: 'Ropsten Test Network',
    chainId: 3,
    knownAccounts: {
      admins: [wallet.toWalletAddress(process.env.PRIVATE_KEY), ...testnetAdmins]
    },
    deployedTokens: {
      DAI: '0x72DeFe8aD5Ae1640DbD0e7f6fA09512058079B89',
      NPM: '0xAbe4dF36CEA4e68Efe58bfe634EdDD9D26C7902B',
      CPOOL: '0xc874c7D316556eaA5Cc440cb75B72C8edBdaD5A4',
      HT: '0xd567596921dFD57aDdb7B4F5959B3C5DB075feB3',
      OKB: '0xa4a2E3C8619F9E2692E676a7425a3203C09145e1',
      AXS: '0x25F935E25b896818AAb066104c2dB5c4aA8f3f3D'
    },
    stablecoinPairs: {
      NPM_DAI: '0x6Ad50cC5Cd00398Aee1e17bC69d4CB8cf542507E',
      CPOOL_DAI: '0xD9f548C9f0f249f65c52D6A7C233289E028f59ca',
      HT_DAI: '0xddBA6A42F44c44F15f4c336eaaD7F51326c84245',
      OKB_DAI: '0x94bB8F102a86eF560e4Cc5a1B6eF1FADE5867253',
      AXS_DAI: '0xB399BF8c4c951C45bd1F3D71752722ec53cd17C2'
    },
    uniswapV2Like: {
      description: 'Sushiswap on Ropsten',
      addresses: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
        masterChef: '0x80C7DD17B01855a6D2347444a0FCC36136a314de'
      }
    }
  }
}

module.exports = config
