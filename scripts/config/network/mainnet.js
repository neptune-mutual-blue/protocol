const { ACCESS_CONTROL } = require('../../../util/key')

const MINUTES = 60
const DAYS = 86400

const config = {
  1: {
    network: 'Main Ethereum Network',
    chainId: 1,
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
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT]
      },
      {
        account: '0x7869A5b3abE9bD24310F2F4a4A26BCe705392eef',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT, ACCESS_CONTROL.NS_ROLES_LIQUIDITY_MANAGER, ACCESS_CONTROL.NS_ROLES_GOVERNANCE_ADMIN]
      },
      {
        account: '0x815d97E50844d84220ebb49205337BF5F814370C',
        roles: [ACCESS_CONTROL.NS_ROLES_RECOVERY_AGENT]
      },
      {
        account: '0xCcfb9BfCA029F28727F5c5c1464262eF4B4db17B',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT]
      },
      {
        account: '0x18f3cF3d5F32b8240e77c26c2432029657a0B34E',
        roles: [ACCESS_CONTROL.NS_ROLES_GOVERNANCE_AGENT]
      },
      {
        account: '0x96531BE2FA623454253465F9f45889FA15e3D6F3',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT, ACCESS_CONTROL.NS_ROLES_RECOVERY_AGENT]
      },
      {
        account: '0xce9c5a73808aB5D75318e04ce7f85c3D115432f4',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT, ACCESS_CONTROL.NS_ROLES_LIQUIDITY_MANAGER, ACCESS_CONTROL.NS_ROLES_GOVERNANCE_ADMIN]
      },
      {
        account: '0xa4206d8EB35FC485714e26DE073c3Fe78a61d9c2',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT, ACCESS_CONTROL.NS_ROLES_GOVERNANCE_AGENT]
      },
      {
        account: '0x1bAAb16dcde441f80CaD42cb7f0E40937217F5a2',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT]
      },
      {
        account: '0xdA1CBd799d8CBC8d6747B2BfA13e2dD4A68ED30E',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT, ACCESS_CONTROL.NS_ROLES_GOVERNANCE_ADMIN]
      },
      {
        account: '0xCd8aAad838C959e8E98cEBE8230A55B28eb14E09',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT, ACCESS_CONTROL.NS_ROLES_UPGRADE_AGENT]
      },
      {
        account: '0xa57A9c56d0aC757eD8f3ad4C897B7fD0BC2500E4',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT, ACCESS_CONTROL.NS_ROLES_COVER_MANAGER]
      },
      {
        account: '0x372CF371B3E130D981EB7cA135b3660a74b69f8a',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT, ACCESS_CONTROL.NS_ROLES_ADMIN, ACCESS_CONTROL.NS_ROLES_RECOVERY_AGENT]
      },
      {
        account: '0x6662a4cbF462cb4b8454cD3cdC7e2140e1cb8437',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT, ACCESS_CONTROL.NS_ROLES_UNPAUSE_AGENT]
      },
      {
        account: '0x2B8efC19Bd71f0271A15B4135b7cd4b5c04984b9',
        roles: [ACCESS_CONTROL.NS_ROLES_PAUSE_AGENT]
      }
    ],
    deployedTokens: {
      NPM: '0xb31AB812aAD7E905A7B8f3263560D2f610d582d7', // POT
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    },
    uniswapV2Like: {
      description: 'Uniswap on Ethereum',
      addresses: {
        factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        npmPriceOracle: null
      }
    },
    aave: {
      description: 'Aave on Ethereum',
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
