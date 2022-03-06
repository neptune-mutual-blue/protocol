require('dotenv').config()
const wallet = require('../../../util/wallet')
const { ACCESS_CONTROL } = require('../../../util/key')
const MINUTES = 60

const config = {
  42: {
    network: 'Kovan Test Network',
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
      DAI: '0xff795577d9ac8bd7d90ee22b6c1703490b6512fd', // Aave Kovan DAI
      NPM: '0x481B55f34Ef7839c408f35f6B57a68cd54B84eFC',
      CRPOOL: '0xbe29A48292218ca80041F03a946a153207EFC868',
      HWT: '0x087BeA6C46A8F6efe94809cC8074fb69445c684e',
      OBK: '0x211C1261d25BE74126728642D2DebD37A611B26E',
      SABRE: '0x52471FFA579f8278fA23eF153c7ac48498Fe772b',
      BEC: '0x8C155c9D52C2Fd2DFCCa2C26e833C1a6eabDbb6d',
      XD: '0xE7559d514EC2d6E1883Dd53DFF4bC108d457f1b6',
      aToken: '0xdcf0af9e59c002fa3aa091a46196b37530fd48a8',
      cDai: '0xF49eBE5A0d62cc8f0318AD14620D17dcc2D53935'
    },
    stablecoinPairs: {
      NPM_DAI: '0x058A0445B488Cba8cab4963181eE7ec3da71e7A0',
      CRPOOL_DAI: '0x4A79e880088687b9b014a15e1a0eec1148bB66C7',
      HWT_DAI: '0xe6fEb3F713B5a40903FF2aad66383059faaa51D8',
      OBK_DAI: '0xaC1e24504432004ea2a8c92Ab4221A002bd2AF1c',
      SABRE_DAI: '0xf9EbDA687bFaCa47c2Ba84417324E27c4ce23662',
      BEC_DAI: '0xAd11864feCf8a2b8b2260c89771d0419a527B532',
      XD_DAI: '0x3A37460ec2675c6A90Dcd00c38Da04a764F684f9'
    },
    uniswapV2Like: {
      description: 'Sushiswap on Kovan',
      addresses: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
        masterChef: '0x80C7DD17B01855a6D2347444a0FCC36136a314de'
      }
    },
    aave: {
      description: 'Aave V2 on Kovan',
      addresses: {
        lendingPool: '0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe'
      }
    },
    compound: {
      dai: {
        delegator: '0xF49eBE5A0d62cc8f0318AD14620D17dcc2D53935'
      }
    }
  }
}

module.exports = config
