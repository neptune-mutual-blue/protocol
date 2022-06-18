const { ether, percentage, STABLECOIN_DECIMALS } = require('../../../util/helper')

const MINUTES = 60
const PRECISION = STABLECOIN_DECIMALS

module.exports = {
  key: '0x7072696d65000000000000000000000000000000000000000000000000000000',
  coverName: 'Prime DApps',
  projectName: null,
  vault: {
    name: 'Prime DApps Locked DAI',
    symbol: 'DAI-P'
  },
  requiresWhitelist: false,
  supportsProducts: true,
  leverage: '10',
  tags: ['Smart Contract', 'DEX', 'Liquidity', 'Lending', 'Borrowing'],
  about: 'Decentralized Exchanges',
  blockchains: [{
    chainId: 1,
    name: 'Main Ethereum Network'
  }],
  rules: `1. Rule 1
            2. Rule 2
            3. Rule 3`,
  exclusions: `1. Exclusion 1
                 2. Exclusion 1
                 3. Exclusion 3`,
  pricingFloor: percentage(6),
  pricingCeiling: percentage(24),
  reportingPeriod: 5 * MINUTES,
  cooldownPeriod: 5 * MINUTES,
  claimPeriod: 5 * MINUTES,
  minReportingStake: ether(2000),
  stakeWithFees: ether(50_000),
  reassurance: ether(50_000, PRECISION),
  reassuranceRate: percentage(25)
}
