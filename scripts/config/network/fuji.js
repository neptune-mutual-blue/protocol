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
      NPM: '0xF7c352D9d6967Bd916025030E38eA58cF48029f8',
      DAI: '0x5B73fd777f535C5A47CC6eFb45d0cc66308B1468',
      CRPOOL: '0x87F9239dC639dFea56cdbbC489e892BbeF5Ab866',
      HWT: '0xf41b5Db8b29414b4E85913D5531740D209A9011C',
      OBK: '0x9f30cB16EA8dCc1885c764C0774717334cABb97a',
      SABRE: '0xd94ccf81DE136A1d8e8a37D226656cf46AD02d65',
      BEC: '0xde492AAb7797e410547435a6b8886aE7168cf092',
      XD: '0xc9d92bE9BdD74F91746c00609E2d77EcC48E5587',
      aToken: '0x5Ba2DB68feC4233f69AAe9Aa2BAcdd583Ab7D34A',
      cDai: '0x27cF653A52Df1517a9491BBa8eCF0bCf3A51759c'
    },
    stablecoinPairs: {
      NPM_DAI: '0x97cCd316db0298498fcfD626b215955b9DF44b71',
      CRPOOL_DAI: '0xfCA386606c94b4f5dF3445b20FaE396B01EEe478',
      HWT_DAI: '0x5156d912B5bE303185d3dB17a05dff57a392fA4B',
      OBK_DAI: '0xF1D7bBa24A32A2355D45d570729c01De55E75478',
      SABRE_DAI: '0x8534cb854A86b49Ebf1aB15A58213E83e78886ab',
      BEC_DAI: '0x3F30cE791CAdCd64720ab3F7139C0bD944205F84',
      XD_DAI: '0xf310e3dC4ef94532B8CD3f9aC19bdaBa92443b53'
    },
    uniswapV2Like: {
      description: 'Pangolin on Fuji',
      addresses: {
        factory: '0xe4a575550c2b460d2307b82dcd7afe84ad1484dd',
        router: '0x2D99ABD9008Dc933ff5c0CD271B88309593aB921',
        masterChef: '',
        npmPriceOracle: '0xA430a90ebC5f3DfA88CDE297331FDDD98437Cd27'
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
