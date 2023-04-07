const { ACCESS_CONTROL } = require('../../../util/key')

const MINUTES = 60
const DAYS = 86400

const config = {
  42161: {
    network: 'Arbitrum One',
    name: 'arbitrum',
    chainId: 42161,
    mainnet: true,
    pool: {
      bond: {
        period: 7 * DAYS
      }
    },
    cover: {
      lendingPeriod: 180 * DAYS,
      withdrawalWindow: 7 * DAYS,
      claimPeriod: 7 * DAYS,
      cooldownPeriod: 1 * DAYS,
      reportingPeriod: 7 * DAYS,
      stateUpdateInterval: 5 * MINUTES
    },
    knownAccounts: [
      {
        account: '0x11D547676578dF738857e7E8077C51C8A223B607',
        roles: [ACCESS_CONTROL.PAUSE_AGENT]
      },
      {
        account: '0x7869A5b3abE9bD24310F2F4a4A26BCe705392eef',
        roles: [ACCESS_CONTROL.PAUSE_AGENT, ACCESS_CONTROL.LIQUIDITY_MANAGER, ACCESS_CONTROL.GOVERNANCE_ADMIN]
      },
      {
        account: '0x815d97E50844d84220ebb49205337BF5F814370C',
        roles: [ACCESS_CONTROL.RECOVERY_AGENT]
      },
      {
        account: '0xCcfb9BfCA029F28727F5c5c1464262eF4B4db17B',
        roles: [ACCESS_CONTROL.PAUSE_AGENT]
      },
      {
        account: '0x18f3cF3d5F32b8240e77c26c2432029657a0B34E',
        roles: [ACCESS_CONTROL.GOVERNANCE_AGENT]
      },
      {
        account: '0x96531BE2FA623454253465F9f45889FA15e3D6F3',
        roles: [ACCESS_CONTROL.PAUSE_AGENT, ACCESS_CONTROL.RECOVERY_AGENT]
      },
      {
        account: '0xce9c5a73808aB5D75318e04ce7f85c3D115432f4',
        roles: [ACCESS_CONTROL.PAUSE_AGENT, ACCESS_CONTROL.LIQUIDITY_MANAGER, ACCESS_CONTROL.GOVERNANCE_ADMIN]
      },
      {
        account: '0xa4206d8EB35FC485714e26DE073c3Fe78a61d9c2',
        roles: [ACCESS_CONTROL.PAUSE_AGENT, ACCESS_CONTROL.GOVERNANCE_AGENT]
      },
      {
        account: '0x1bAAb16dcde441f80CaD42cb7f0E40937217F5a2',
        roles: [ACCESS_CONTROL.PAUSE_AGENT]
      },
      {
        account: '0xdA1CBd799d8CBC8d6747B2BfA13e2dD4A68ED30E',
        roles: [ACCESS_CONTROL.PAUSE_AGENT, ACCESS_CONTROL.GOVERNANCE_ADMIN]
      },
      {
        account: '0xCd8aAad838C959e8E98cEBE8230A55B28eb14E09',
        roles: [ACCESS_CONTROL.PAUSE_AGENT, ACCESS_CONTROL.UPGRADE_AGENT]
      },
      {
        account: '0xa57A9c56d0aC757eD8f3ad4C897B7fD0BC2500E4',
        roles: [ACCESS_CONTROL.PAUSE_AGENT, ACCESS_CONTROL.COVER_MANAGER]
      },
      {
        account: '0x372CF371B3E130D981EB7cA135b3660a74b69f8a',
        roles: [ACCESS_CONTROL.PAUSE_AGENT, ACCESS_CONTROL.ADMIN, ACCESS_CONTROL.RECOVERY_AGENT]
      },
      {
        account: '0x6662a4cbF462cb4b8454cD3cdC7e2140e1cb8437',
        roles: [ACCESS_CONTROL.PAUSE_AGENT, ACCESS_CONTROL.UNPAUSE_AGENT]
      },
      {
        account: '0x2B8efC19Bd71f0271A15B4135b7cd4b5c04984b9',
        roles: [ACCESS_CONTROL.PAUSE_AGENT]
      }
    ],
    deployedTokens: {
      NPM: '0xb31AB812aAD7E905A7B8f3263560D2f610d582d7', // POT
      USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
    },
    uniswapV2Like: {
      description: 'Sushiswap v2 on Arbitrum',
      addresses: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
        npmPriceOracle: null
      }
    },
    aave: {
      description: 'Aave on Arbitrum',
      addresses: {
        lendingPool: ''
      }
    },
    compound: {
      stablecoin: {
        delegator: ''
      }
    },
    protocol: {
      burner: '0x365673739e2d8F46DCCce07866e9f53A19526918',
      treasury: '0x5e4B7212Beb8926fc925328e890dBe6c6fC971f0'
    }
  }
}

module.exports = config
