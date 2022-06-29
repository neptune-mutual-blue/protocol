const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x73796e7468657469780000000000000000000000000000000000000000000000',
  productName: 'Synthetix',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(70),
  tags: ['Smart Contract'],
  about: 'Synthetix is a new financial primitive enabling the creation of synthetic assets, offering unique derivatives and exposure to real-world assets on the blockchain.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://synthetix.io/',
    discord: 'https://discord.com/invite/AEdUHzt',
    twitter: 'https://twitter.com/synthetix_io',
    github: 'https://github.com/synthetixio',
    blog: 'https://blog.synthetix.io/',
    dao: 'https://synthetix.io/governance',
    documentation: 'https://docs.synthetix.io/'
  },
  resolutionSources: [
    'https://twitter.com/synthetix_io',
    'https://twitter.com/neptunemutual'
  ]
}
