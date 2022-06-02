require('dotenv').config()
const wallet = require('../../../util/wallet')
const { ACCESS_CONTROL } = require('../../../util/key')
const MINUTES = 60

const config = {
  43113: {
    network: 'Avalanche FUJI C-Chain',
    chainId: 43113,
    pool: {
      bond: {
        period: 10 * MINUTES
      }
    },
    cover: {
      lendingPeriod: 60 * MINUTES,
      withdrawalWindow: 60 * MINUTES,
      claimPeriod: 120 * MINUTES,
      cooldownPeriod: 5 * MINUTES,
      stateUpdateInterval: 5 * MINUTES
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
      DAI: '0x9400A36639109cb3034637676384FB518cC5e297', // NPM DAI
      NPM: '0x0975d708467052111D151e91aE3558bfdae4c51E',
      CRPOOL: '0xC93985E1893729e340Ffb4d19d6B345031D62086',
      HWT: '0x8805FC647DADe6e9dC8cfE3b348d9173F47800E8',
      OBK: '0x001Ffb65fF6E15902072C5133C016fD89cB56a7e',
      SABRE: '0x76061C192fBBBF210d2dA25D4B8aaA34b798ccaB',
      BEC: '0xF1DD0d797b720578DE3075241941451A793D383E',
      XD: '0xC8B328a39570620f67c795Ae79a0aE12066dc51a',
      aToken: '0xe478c01B7A85fCe760EB6ECe8a6045ee012d3120',
      cDai: '0xA07AB167e48293957CDcAFf8Ec0E4081593ad303'
    },
    stablecoinPairs: {
      NPM_DAI: '0xd91b127e7d559D41e83de84907C81b85dCB64697',
      CRPOOL_DAI: '0xb8480Aa071b99c814FF321Dee36B967031ac8E6b',
      HWT_DAI: '0xC80f7Bb6b9500c88bb0941fC5DAfe185A7D400Ac',
      OBK_DAI: '0xf9D6F05C67F1086aE641904AB9D80a89202Ef1DD',
      SABRE_DAI: '0x3845aeDCD94Ab90e5D8FAd7db4145cA9beF0F04B',
      BEC_DAI: '0x28d379148Ba807690d274F48A0Be4F2ED69ba2aD',
      XD_DAI: '0x5aFB9DD3516d6a5d8cB34C50b0f406206aD4FB9c'
    },
    uniswapV2Like: {
      description: 'Pangolin on Fuji',
      addresses: {
        factory: '0xe4a575550c2b460d2307b82dcd7afe84ad1484dd',
        router: '0x2D99ABD9008Dc933ff5c0CD271B88309593aB921',
        masterChef: '',
        npmPriceOracle: '0x62B9E8B870666C79D7d49b7B70BA2205E0aBA03a'
      }
    },
    aave: {
      description: 'Aave V2 on Fuji',
      addresses: {
        lendingPool: null
      }
    },
    compound: {
      dai: {
        delegator: ''
      }
    }
  }
}

module.exports = config
