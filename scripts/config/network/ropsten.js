require('dotenv').config()
const wallet = require('../../../util/wallet')
const MINUTES = 60
const { ACCESS_CONTROL } = require('../../../util/key')

const config = {
  3: {
    network: 'Ropsten Test Network',
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
          // ACCESS_CONTROL.ADMIN, // Already an admin
          ACCESS_CONTROL.COVER_MANAGER,
          ACCESS_CONTROL.LIQUIDITY_MANAGER,
          ACCESS_CONTROL.GOVERNANCE_ADMIN,
          ACCESS_CONTROL.RECOVERY_AGENT,
          ACCESS_CONTROL.UNPAUSE_AGENT,
          ACCESS_CONTROL.UPGRADE_AGENT
        ]
      },
      {
        account: '0xA96813969437F3bad7B59335934aa75933670615',
        roles: [
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
      DAI: '0xf80a32a835f79d7787e8a8ee5721d0feafd78108', // Aave Ropsten DAI
      NPM: '0x481B55f34Ef7839c408f35f6B57a68cd54B84eFC',
      CPOOL: '0x28f61374cC7fF2b0181064D21F09993a6972e7D3',
      HT: '0x131c05b860c89B59f5b5aa6901434F20F19D5C2f',
      OKB: '0xcED1a80c495a27fF2310E59F75034c76faC6bacf',
      AXS: '0xF1A75e2bfB5bd5DF9a6cC07ecadaD236258950EF',
      aToken: '0x86067C23557D97286027095b868DF6A765aaED5f',
      cDai: '0xe712D7e2D2547E3A4C37Ec16AdFa22fA079F346d'
    },
    stablecoinPairs: {
      NPM_DAI: '0xf45E1A6847b41832cc43644dc7F46CdFA18730A1',
      CPOOL_DAI: '0x5F3b167C1C3127dBD48119c0Ee5aAa4A3d3E5520',
      HT_DAI: '0x6e7E019E7195417A149077DfE64ACF6c7e5b7cCc',
      OKB_DAI: '0x36685dfB4dC9e41C2a281B585bbc36cc929118D2',
      AXS_DAI: '0xA51c26E99049c3d0b0BE4706BF54C88774b9cE94'
    },
    uniswapV2Like: {
      description: 'Sushiswap on Ropsten',
      addresses: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
        masterChef: '0x80C7DD17B01855a6D2347444a0FCC36136a314de'
      }
    },
    aave: {
      description: 'Aave V2 on Ropsten',
      addresses: {
        lendingPool: null
      }
    },
    compound: {
      dai: {
        delegator: '0xe712D7e2D2547E3A4C37Ec16AdFa22fA079F346d'
      }
    }
  }
}

module.exports = config
