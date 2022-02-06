require('dotenv').config()
const wallet = require('../../../util/wallet')
const MINUTES = 60
const { ACCESS_CONTROL } = require('../../../util/key')

const config = {
  3: {
    network: 'Ropsten Test Network',
    chainId: 3,
    cover: {
      minLiquidityPeriod: 5 * MINUTES,
      claimPeriod: 120 * MINUTES
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
      NPM: '0xa2F795CB8cdCa83f8D3d5F2D84BFC45c9b3A4197',
      CPOOL: '0x9912B6Fc42675DC940313551b20c022219b98Adb',
      HT: '0xe2e3cAA55dEdb93f802B16314B4579c9a57d3B0e',
      OKB: '0x1DC3318aaAfE76BC825365DcF3518B83e2137894',
      AXS: '0xaBccBfdfd5Ff2855236C371D70Dc7951a3F3ba5B',
      aToken: '0x86067C23557D97286027095b868DF6A765aaED5f',
      cDai: '0xe712D7e2D2547E3A4C37Ec16AdFa22fA079F346d'
    },
    stablecoinPairs: {
      NPM_DAI: '0x773992D8d8932e3153Eab3499a1b662E2e57E283',
      CPOOL_DAI: '0xa3831BdDba111773dc9919007E322A36003ed7E8',
      HT_DAI: '0x6CAcF6146FFa792AAd797451Df5fCD5F3ace0470',
      OKB_DAI: '0x688C2D6183b4e8669cE6814aB63860d565701157',
      AXS_DAI: '0x2519c7E52ccFA72f306a4907e5f727F189cb9F05'
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
