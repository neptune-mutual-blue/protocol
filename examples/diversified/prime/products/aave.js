const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x6161766500000000000000000000000000000000000000000000000000000000',
  productName: 'Aave Protocol',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(90),
  tags: ['Ehereum', 'DApp', 'Prime', 'Smart Contract', 'Lending', 'Flash Loan', 'Interest Bearing Tokens', 'aToken'],
  about: 'Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://aave.com/',
    documentation: 'https://docs.aave.com/',
    twitter: 'https://twitter.com/aaveaave',
    github: 'https://github.com/aave',
    discord: 'https://discord.com/invite/CvKUrqM',
    telegram: 'https://t.me/Aavesome',
    blog: 'https://medium.com/aave',
    linkedin: ''
  },
  resolutionSources: [
    'https://twitter.com/aaveaave',
    'https://medium.com/aave',
    'https://twitter.com/neptunemutual'
  ]
}
