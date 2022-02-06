require('dotenv').config()
const wallet = require('../../../util/wallet')
const MINUTES = 60
const { ACCESS_CONTROL } = require('../../../util/key')

const config = {
  42: {
    network: 'Kovan Test Network',
    chainId: 3,
    cover: {
      minLiquidityPeriod: 5 * MINUTES,
      claimPeriod: 120 * MINUTES
    },
    knownAccounts: [
      {
        account: wallet.toWalletAddress(process.env.PRIVATE_KEY),
        roles: [
          ACCESS_CONTROL.ADMIN,
          ACCESS_CONTROL.COVER_MANAGER,
          ACCESS_CONTROL.LIQUIDITY_MANAGER,
          ACCESS_CONTROL.GOVERNANCE_ADMIN,
          ACCESS_CONTROL.RECOVERY_AGENT,
          ACCESS_CONTROL.UNPAUSE_AGENT,
          ACCESS_CONTROL.UPGRADE_AGENT
        ]
      }, {
        account: '0xA96813969437F3bad7B59335934aa75933670615',
        roles: [
          ACCESS_CONTROL.ADMIN,
          ACCESS_CONTROL.COVER_MANAGER,
          ACCESS_CONTROL.LIQUIDITY_MANAGER,
          ACCESS_CONTROL.GOVERNANCE_ADMIN,
          ACCESS_CONTROL.RECOVERY_AGENT,
          ACCESS_CONTROL.UNPAUSE_AGENT,
          ACCESS_CONTROL.UPGRADE_AGENT
        ]
      }
    ],
    deployedTokens: {
      DAI: '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd', // Aave Kovan DAI
      NPM: '0x0d21fF540b6040d9152F5c2E101081a0243Bf30A',
      CPOOL: '0x0094C12E7acb84E999C5c69746C48F8D51d836ca',
      HT: '0x921e65d8A0F071caa170efD316Cd1bc2bf6225e0',
      OKB: '0x20B69b8a65B235d1FDA63B074Dc8e0E74bb35e19',
      AXS: '0x6575efCb04306Af46414e0425162a54734B9e024',
      aToken: '0xdcf0af9e59c002fa3aa091a46196b37530fd48a8',
      cDai: '0xF49eBE5A0d62cc8f0318AD14620D17dcc2D53935'
    },
    stablecoinPairs: {
      NPM_DAI: '0x68783fD3030035DE814B00Aa6051EA253A6E31e0',
      CPOOL_DAI: '0x366e82434f1108Ec7ecD7C73408d9ba71F1d0589',
      HT_DAI: '0x9166bE80b9C647d4370a73ae1f58E93904A9AfBb',
      OKB_DAI: '0x6677357FeB48BD397EBf68146931631721b817f0',
      AXS_DAI: '0x1fB7a7046D5e1b2DfA8b2169456bEb0Acc04F7ed'
    },
    uniswapV2Like: {
      description: 'Sushiswap on Kovan',
      addresses: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
        masterChef: '0x80C7DD17B01855a6D2347444a0FCC36136a314de'
      }
    },
    aave: {
      description: 'Aave V2 on Kovan',
      addresses: {
        lendingPool: '0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe'
      }
    },
    compound: {
      dai: {
        delegator: '0xF49eBE5A0d62cc8f0318AD14620D17dcc2D53935'
      }
    }
  }
}

module.exports = config
