const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x636f6d706f756e64000000000000000000000000000000000000000000000000',
  productName: 'Compound',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(70),
  tags: ['Ehereum', 'DApp', 'Prime', 'Smart Contract', 'Lending', 'Interest Bearing Tokens', 'cToken'],
  about: 'Compound is an algorithmic, autonomous interest rate protocol built for developers, to unlock a universe of open financial applications.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://compound.finance/',
    twitter: 'https://twitter.com/compoundfinance',
    blog: 'https://medium.com/compound-finance',
    discord: 'https://discord.com/invite/fq6JSPkpJn',
    github: 'https://github.com/compound-finance/compound-protocol'
  },
  resolutionSources: [
    'https://twitter.com/compoundfinance',
    'https://twitter.com/neptunemutual'
  ]
}
