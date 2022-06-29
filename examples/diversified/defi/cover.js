const { ether, percentage, STABLECOIN_DECIMALS } = require('../../../util/helper')

const MINUTES = 60
const PRECISION = STABLECOIN_DECIMALS

module.exports = {
  key: '0x6465666900000000000000000000000000000000000000000000000000000000',
  coverName: 'Popular DeFi Apps',
  projectName: null,
  vault: {
    name: 'DAI Locked in DeFi Pool',
    symbol: 'DAI-D'
  },
  requiresWhitelist: false,
  supportsProducts: true,
  leverage: '10',
  tags: ['Smart Contract', 'DEX', 'Liquidity'],
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
  pricingFloor: percentage(10),
  pricingCeiling: percentage(32),
  reportingPeriod: 5 * MINUTES,
  cooldownPeriod: 5 * MINUTES,
  claimPeriod: 5 * MINUTES,
  minReportingStake: ether(2000),
  stakeWithFees: ether(50_000),
  reassurance: ether(50_000, PRECISION),
  reassuranceRate: percentage(25)
}
