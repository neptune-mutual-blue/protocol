require('dotenv').config()
const wallet = require('../../../util/wallet')
const { ACCESS_CONTROL } = require('../../../util/key')
const MINUTES = 60

const config = {
  42: {
    network: 'Kovan Test Network',
    chainId: 3,
    pool: {
      bond: {
        period: 10 * MINUTES
      }
    },
    cover: {
      minLiquidityPeriod: 5 * MINUTES,
      claimPeriod: 120 * MINUTES,
      cooldownPeriod: 5 * MINUTES
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
      NPM: '0x481B55f34Ef7839c408f35f6B57a68cd54B84eFC',
      CPOOL: '0x28f61374cC7fF2b0181064D21F09993a6972e7D3',
      HT: '0x131c05b860c89B59f5b5aa6901434F20F19D5C2f',
      OKB: '0xcED1a80c495a27fF2310E59F75034c76faC6bacf',
      AXS: '0xF1A75e2bfB5bd5DF9a6cC07ecadaD236258950EF',
      aToken: '0xdcf0af9e59c002fa3aa091a46196b37530fd48a8',
      cDai: '0xF49eBE5A0d62cc8f0318AD14620D17dcc2D53935'
    },
    stablecoinPairs: {
      NPM_DAI: '0x058A0445B488Cba8cab4963181eE7ec3da71e7A0',
      CPOOL_DAI: '0x4d77b98b824949DC97c475B4f12Ec096fd6767aF',
      HT_DAI: '0x90B3EE0EaF77261e11B3e434A55a8807cbE7b13A',
      OKB_DAI: '0x35302e6C59047804af87F45B05759BB2e077B496',
      AXS_DAI: '0x65A6F643867C550Dd95721b0fb37541f2749B54B'
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
