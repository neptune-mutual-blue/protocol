const { ACCESS_CONTROL } = require('../../../util/key')
const wallet = require('../../../util/wallet')

const DAYS = 86400
const HOURS = 3600

const config = {
  31338: {
    network: 'Hardhat',
    name: 'hardhat',
    chainId: 31338,
    mainnet: false,
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
      stateUpdateInterval: 1 * HOURS
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
    uniswapV2Like: null,
    protocol: {
      burner: '0x0000000000000000000000000000000000000001',
      treasury: '0x0000000000000000000000000000000000000001'
    }
  }
}

module.exports = config
