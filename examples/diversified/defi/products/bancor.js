const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x62616e636f720000000000000000000000000000000000000000000000000000',
  productName: 'Bancor',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(70),
  tags: ['Smart Contract'],
  about: 'Bancor is a decentralized network of on-chain automated market makers (AMMs) supporting instant, low-cost trading, as well as Single-Sided Staking and 100% Impermanent Loss Protection for any listed token.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://home.bancor.network/',
    twitter: 'https://twitter.com/Bancor',
    blog: 'https://bancor.medium.com/',
    documentation: 'https://docs.bancor.network/',
    discord: 'https://discord.com/invite/5d3JXqYQGj',
    telegram: 'https://t.me/bancor',
    github: 'https://github.com/bancorprotocol'

  },
  resolutionSources: [
    'https://twitter.com/Bancor',
    'https://twitter.com/neptunemutual'
  ]
}
