const { key, helper } = require('../../../../util')
const { ether, percentage } = helper

const DAYS = 86400

module.exports = {
  coverKey: key.toBytes32('popular-defi-apps'),
  coverName: 'Popular DeFi Apps',
  projectName: null,
  tokenName: 'Yield Bearing USDC',
  tokenSymbol: 'iUSDC-POP',
  requiresWhitelist: false,
  supportsProducts: true,
  leverageFactor: '6',
  tags: ['nft', 'exchange', 'dex', 'swap', 'fork', 'stablecoin', 'lending', 'flashloan', 'borrowing', 'interest', 'loan', 'staking', 'yield', 'insurance', 'payment'],
  about: '',
  blockchains: [
    {
      chainId: 56,
      name: 'BNB Chain'
    }
  ],
  floor: percentage(2),
  ceiling: percentage(12),
  reportingPeriod: 7 * DAYS,
  cooldownPeriod: 1 * DAYS,
  claimPeriod: 7 * DAYS,
  minStakeToReport: ether(10_000),
  stakeWithFee: ether(12_500),
  initialReassuranceAmount: '0',
  reassuranceRate: percentage(25)
}
