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
      lendingPeriod: 60 * MINUTES,
      withdrawalWindow: 60 * MINUTES,
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
      SUPRA: '0xD4F8c7AA64aA09677064b930a168E0A3D5a4aBEc',
      BMC: '0x96B34fa8AFCdaC57833bD8333F7A40b0719B9470',
      XT: '0x986a5ee528B000B257B6A2453f0107839cc06Fbb',
      aToken: '0x86067C23557D97286027095b868DF6A765aaED5f',
      cDai: '0xe712D7e2D2547E3A4C37Ec16AdFa22fA079F346d'
    },
    stablecoinPairs: {
      NPM_DAI: '0xf45E1A6847b41832cc43644dc7F46CdFA18730A1',
      CPOOL_DAI: '0x5F3b167C1C3127dBD48119c0Ee5aAa4A3d3E5520',
      HT_DAI: '0x6e7E019E7195417A149077DfE64ACF6c7e5b7cCc',
      OKB_DAI: '0x36685dfB4dC9e41C2a281B585bbc36cc929118D2',
      SUPRA_DAI: '0xDE58BFf7058BD776Cf68C286317328dbca297265',
      BMC_DAI: '0x034aE1d43887E319e7e8C1122C106A0d046CFaC2',
      XT_DAI: '0xFEF43C0c4d363118401EF17441b85A742df32B1E'
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
