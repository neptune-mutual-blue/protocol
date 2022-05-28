require('dotenv').config()
const wallet = require('../../../util/wallet')
const { ACCESS_CONTROL } = require('../../../util/key')
const MINUTES = 60

const config = {
  80001: {
    network: 'Mumbai Testnet',
    chainId: 80001,
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
      DAI: '0x76061C192fBBBF210d2dA25D4B8aaA34b798ccaB', // NPM DAI
      NPM: '0x001Ffb65fF6E15902072C5133C016fD89cB56a7e',
      CRPOOL: '0xF1DD0d797b720578DE3075241941451A793D383E',
      HWT: '0xC8B328a39570620f67c795Ae79a0aE12066dc51a',
      OBK: '0xe478c01B7A85fCe760EB6ECe8a6045ee012d3120',
      SABRE: '0xA07AB167e48293957CDcAFf8Ec0E4081593ad303',
      BEC: '0xC6aa2672F65617296ce65B67Dc035F65ADFE0701',
      XD: '0xfE580ca5A2876e85489AbA1FdfCe172186302a9e',
      aToken: '0x8734F2E9c0C2531B8eFe72cae894FC0400D35E3D',
      cDai: '0x6A7B699e1a2d28489b939C9Bcb4dDEF02F792a67'
    },
    stablecoinPairs: {
      NPM_DAI: '0x40D135283d8aE7815F26c39D3980cA47B062e473',
      CRPOOL_DAI: '0x9c799908cbDEAf9622843F6493C975262bd880D0',
      HWT_DAI: '0xfcAd7c5372688C4dBe00611714075ACb8D1ED8b7',
      OBK_DAI: '0x6e8D6D5F8C079efC5CDc950CB946b773E162B3fb',
      SABRE_DAI: '0x41cCD6D6dAE890b2dD13e45544CDCaFFef8437b8',
      BEC_DAI: '0xbf97BbBa44b5D0225179757f0eB33A52297F3828',
      XD_DAI: '0x9123f59C472f8186CBa11833975c08494FAB450E'
    },
    uniswapV2Like: {
      description: 'Quickswap on Mumbai',
      addresses: {
        factory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
        router: '0x8954AfA98594b838bda56FE4C12a09D7739D179b',
        masterChef: '',
        npmPriceOracle: '0x171805fd059590A36DB0e72f7aD644dCE1edbE6a'
      }
    },
    aave: {
      description: 'Aave V2 on Mumbai',
      addresses: {
        lendingPool: null
      }
    },
    compound: {
      dai: {
        delegator: '0x6A7B699e1a2d28489b939C9Bcb4dDEF02F792a67'
      }
    }
  }
}

module.exports = config
