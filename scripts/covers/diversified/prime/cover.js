const { key, helper } = require('../../../../util')
const { ether, percentage } = helper

const DAYS = 86400

module.exports = {
  coverKey: key.toBytes32('prime'),
  coverName: 'Prime dApps',
  projectName: null,
  tokenName: 'Yield Bearing USDC',
  tokenSymbol: 'iUSDC-PRI',
  requiresWhitelist: false,
  supportsProducts: true,
  leverageFactor: '6',
  tags: ['nft', 'exchange', 'dex', 'swap', 'fork', 'stablecoin', 'lending', 'flashloan', 'borrowing', 'interest', 'loan', 'staking', 'yield', 'insurance', 'payment'],
  about: '',
  blockchains: [{
    chainId: 1,
    name: 'Main Ethereum Network'
  }],
  floor: percentage(0.5),
  ceiling: percentage(8),
  reportingPeriod: 7 * DAYS,
  cooldownPeriod: 1 * DAYS,
  claimPeriod: 7 * DAYS,
  minStakeToReport: ether(10_000),
  stakeWithFee: ether(12_000),
  initialReassuranceAmount: '0',
  reassuranceRate: percentage(25)
}
