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
      CRPOOL: '0xbe29A48292218ca80041F03a946a153207EFC868',
      HWT: '0x087BeA6C46A8F6efe94809cC8074fb69445c684e',
      OBK: '0x211C1261d25BE74126728642D2DebD37A611B26E',
      SABRE: '0x52471FFA579f8278fA23eF153c7ac48498Fe772b',
      BEC: '0x8C155c9D52C2Fd2DFCCa2C26e833C1a6eabDbb6d',
      XD: '0xE7559d514EC2d6E1883Dd53DFF4bC108d457f1b6',
      aToken: '0x86067C23557D97286027095b868DF6A765aaED5f',
      cDai: '0xe712D7e2D2547E3A4C37Ec16AdFa22fA079F346d'
    },
    stablecoinPairs: {
      NPM_DAI: '0xf45E1A6847b41832cc43644dc7F46CdFA18730A1',
      CRPOOL_DAI: '0x7f722042C269Dd558071f7697135D79eb6c33438',
      HWT_DAI: '0x1bDD3cA626cd9861966D12f5447C4E7A435e110C',
      OBK_DAI: '0x67DA597bB6EC0b41775697329E89C83329c92054',
      SABRE_DAI: '0xb0f0BbD1E832a35C216827234d1f2830c732A176',
      BEC_DAI: '0x704AEfA7f09d2feCaD35181dD4A7bead5118b11a',
      XD_DAI: '0x7A2F1AAdf3121165eabD650A8A9A6b3cC493b2a4'
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
