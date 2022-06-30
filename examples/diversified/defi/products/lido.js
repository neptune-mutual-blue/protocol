const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x6c69646f00000000000000000000000000000000000000000000000000000000',
  productName: 'Lido (ETH)',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(90),
  tags: ['Smart Contract', 'ETH2.0', 'Staking'],
  about: 'Lido is the leading liquid staking solution - providing a simple and secure way to earn interest on your digital assets. By staking with Lido your assets remain liquid and can be used across a range of DeFi applications, earning extra yield.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://lido.fi/',
    documentation: 'https://docs.lido.fi/',
    telegram: 'https://t.me/lidofinance',
    twitter: 'https://twitter.com/lidofinance',
    discord: 'https://discord.com/invite/lido',
    github: 'https://github.com/lidofinance',
    reddit: 'https://www.reddit.com/r/LidoFinance/',
    blog: 'https://blog.lido.fi/'
  },
  resolutionSources: [
    'https://twitter.com/lidofinance',
    'https://twitter.com/neptunemutual'
  ]
}
