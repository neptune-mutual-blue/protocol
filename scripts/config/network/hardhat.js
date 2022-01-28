// const mainnet = require('./mainnet')
// const knownAccounts = mainnet['1'].knownAccounts
// const uniswapV2Like = mainnet['1'].uniswapV2Like
const { ACCESS_CONTROL } = require('../../../util/key')
const wallet = require('../../../util/wallet')

const DAYS = 86400

const config = {
  31337: {
    network: 'Hardhat Forked Ethereum Network',
    chainId: 31337,
    cover: {
      minLiquidityPeriod: 7 * DAYS,
      claimPeriod: 7 * DAYS
    },
    // knownAccounts,
    // uniswapV2Like,
    knownAccounts: [
      {
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
      }, {
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
      }
    ],
    uniswapV2Like: null
  }
}

module.exports = config
