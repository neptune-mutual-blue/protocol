const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x70616e63616b6573776170000000000000000000000000000000000000000000',
  productName: 'Pancakeswap',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(50),
  tags: ['Smart Contract'],
  about: 'PancakeSwap is the leading decentralized exchange on BNB Smart Chain, with the highest trading volumes in the market',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://pancakeswap.finance/',
    twitter: 'https://twitter.com/pancakeswap',
    blog: 'https://pancakeswap.medium.com/',
    reddit: 'https://www.reddit.com/r/pancakeswap/',
    instagram: 'https://www.instagram.com/pancakeswap_official/',
    github: 'https://github.com/pancakeswap/',
    discord: 'https://discord.com/invite/pancakeswap',
    documentation: 'https://docs.pancakeswap.finance/brand'
  },
  resolutionSources: [
    'https://twitter.com/pancakeswap',
    'https://twitter.com/neptunemutual'
  ]
}
