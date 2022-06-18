const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x31696e6368000000000000000000000000000000000000000000000000000000',
  productName: '1inch ',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(90),
  tags: ['Smart Contract'],
  about: 'The 1inch Network unites decentralized protocols whose synergy enables the most lucrative, fastest, and protected operations in the DeFi space by offering access to hundreds of liquidity sources across multiple chains. The 1inch Network was launched at the ETHGlobal New York hackathon in May 2019 with the release of its Aggregation Protocol v1. Since then, 1inch Network has developed additional DeFi tools such as the Liquidity Protocol, Limit Order Protocol, P2P transactions, and 1inch Mobile Wallet.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://1inch.io/',
    twitter: 'https://twitter.com/1inch',
    blog: 'https://blog.1inch.io/',
    documentation: 'https://docs.1inch.io/',
    reddit: 'https://www.reddit.com/r/1inch/',
    discord: 'https://discord.com/invite/1inch',
    youtube: 'https://www.youtube.com/channel/UCk0nvK4bHpteQXZKv7lkq5w',
    telegram: 'https://t.me/OneInchNetwork',
    github: 'https://github.com/1inch'
  },
  resolutionSources: [
    'https://twitter.com/1inch',
    'https://blog.1inch.io/',
    'https://twitter.com/neptunemutual'
  ]
}
