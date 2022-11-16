require('dotenv').config()
const wallet = require('../../../util/wallet')
const { ACCESS_CONTROL } = require('../../../util/key')
const DAYS = 86400
const MINUTES = 60

const config = {
  80001: {
    network: 'Mumbai Testnet',
    chainId: 80001,
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
      reportingPeriod: 7 * DAYS,
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
      NPM: '0xF7c352D9d6967Bd916025030E38eA58cF48029f8',
      USDC: '0x5B73fd777f535C5A47CC6eFb45d0cc66308B1468',
      CRPOOL: '0x87F9239dC639dFea56cdbbC489e892BbeF5Ab866',
      HWT: '0xf41b5Db8b29414b4E85913D5531740D209A9011C',
      OBK: '0x9f30cB16EA8dCc1885c764C0774717334cABb97a',
      SABRE: '0xd94ccf81DE136A1d8e8a37D226656cf46AD02d65',
      BEC: '0xde492AAb7797e410547435a6b8886aE7168cf092',
      XD: '0xc9d92bE9BdD74F91746c00609E2d77EcC48E5587',
      aToken: '0x5Ba2DB68feC4233f69AAe9Aa2BAcdd583Ab7D34A',
      cStablecoin: '0x6A7B699e1a2d28489b939C9Bcb4dDEF02F792a67'
    },
    stablecoinPairs: {
      NPM_STABLECOIN: '0xfD973D67739a9954751B7daeEeAA128E1193d695',
      CRPOOL_STABLECOIN: '0x2EDF08431Fb3FC1Fb53e3A7Bd9Ba347802030EDd',
      HWT_STABLECOIN: '0x22427Eb0fAcF261124989eC39D47BE1EB67c9490',
      OBK_STABLECOIN: '0x4Ad046e042e7430C11cc35D31ff62D0554f1c902',
      SABRE_STABLECOIN: '0x4CED5eef8F21B53E6b6a9B21354efbab2Bf82C42',
      BEC_STABLECOIN: '0xEe901Cf2bd7d934680Cd32babFFbe5231e540ffa',
      XD_STABLECOIN: '0xF4F9ba264FC70E8BbD228a4D568eB66FCFb3bfCf'
    },
    uniswapV2Like: {
      description: 'Quickswap on Mumbai',
      addresses: {
        factory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
        router: '0x8954AfA98594b838bda56FE4C12a09D7739D179b',
        masterChef: '',
        npmPriceOracle: '0x5419Be71C14D159354FD5490e88E6DF2F180eE76'
      }
    },
    aave: {
      description: 'Aave V2 on Mumbai',
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
