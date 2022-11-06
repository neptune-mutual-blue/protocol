const { key, helper } = require('../../../util')
const { ether, percentage, STABLECOIN_DECIMALS } = helper

const MINUTES = 60
const PRECISION = STABLECOIN_DECIMALS

module.exports = {
  coverKey: key.toBytes32('defi'),
  coverName: 'Popular DeFi Apps',
  projectName: null,
  tokenName: 'Yield Bearing USDC',
  tokenSymbol: 'iUSDC-POP',
  requiresWhitelist: false,
  supportsProducts: true,
  leverageFactor: '10',
  tags: ['nft', 'exchange', 'dex', 'swap', 'fork', 'stablecoin', 'lending', 'flashloan', 'borrowing', 'interest', 'loan', 'staking', 'yield', 'insurance', 'payment'],
  about: '',
  blockchains: [{
    chainId: 1,
    name: 'Main Ethereum Network'
  }],
  floor: percentage(2),
  ceiling: percentage(12),
  reportingPeriod: 5 * MINUTES,
  cooldownPeriod: 5 * MINUTES,
  claimPeriod: 5 * MINUTES,
  minStakeToReport: ether(2000),
  stakeWithFee: ether(2000),
  initialReassuranceAmount: ether(50_000, PRECISION),
  reassuranceRate: percentage(25)
}
