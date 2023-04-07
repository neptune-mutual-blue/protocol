require('dotenv').config()
const wallet = require('../../../util/wallet')
const { ACCESS_CONTROL } = require('../../../util/key')
const MINUTES = 60

const config = {
  84531: {
    network: 'Base Goerli',
    name: 'basegoerli',
    chainId: 84531,
    mainnet: false,
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
      reportingPeriod: 5 * MINUTES,
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
      NPM: '0x4BbDc138dd105C7ddE874df7FCd087b064F7973d',
      USDC: '0xbdCDBD278467b84F67AEE5737Ddc83A9C054cC29',
      CRPOOL: '0x8f01ef6Dd3358E9CD2fb55ad6C7B45C31898724F',
      HWT: '0x7Cbf915E8a9C26F8E6BA055c80E94Ef38B98E1f5',
      OBK: '0xb3D1eFd23F07D87a83A6adA52E4cF448E21415e8',
      SABRE: '0x25C7627C62cbDc9184A42614d7b667B3f4644c0F',
      BEC: '0xEe97c7334a31f399D23741c792FBD9C6814d59b3',
      XD: '0x7bAEa83DbaF5dC651aab326C88Ecd75e33e2D643',
      aToken: '0x4E24748f2f3E8d0126Ac1B4476ceB62553C86c5d',
      cStablecoin: '0x604209E238101298C47dd2779c8bd217Fb84Da3D'
    },
    stablecoinPairs: {
      NPM_STABLECOIN: '0xf02c6BC3ec89A62fCb373D36dF0Dd618162e6476',
      CRPOOL_STABLECOIN: '0xFb371B9d612AbA626801275E19B40c2a0fd5592C',
      HWT_STABLECOIN: '0xBfe9B5000BCB6F9fe797154a58C6b770085DF79F',
      OBK_STABLECOIN: '0x012d87c0C24b776A248d020270C6D05bB8800787',
      SABRE_STABLECOIN: '0x42d60Ed102B289E581146A35F3a42aa5d92D0f19',
      BEC_STABLECOIN: '0x623E84b024f74ADCd0AAD5A4AD140E4D2F47AEbf',
      XD_STABLECOIN: '0xC87DA93648A3E4920D705A6bF32b627459D6322B'
    },
    uniswapV2Like: {
      description: 'Npmswap on Base',
      addresses: {
        factory: '0x352f2178BD6F1960d53e6c10CD1538AB4D97705B',
        router: '0x9D39851E176f3d9431EBcf4F4F87c5fE74435537',
        masterChef: '',
        npmPriceOracle: '0x86eDE99875faEa617Bf2E37F161f87735f966EC1'
      }
    },
    aave: {
      description: 'Aave V2 on Base Goerli',
      addresses: {
        lendingPool: null
      }
    },
    compound: {
      stablecoin: {
        delegator: ''
      }
    },
    protocol: {
      burner: '0x0000000000000000000000000000000000000001',
      treasury: '0x0000000000000000000000000000000000000001'
    }
  }
}

module.exports = config
