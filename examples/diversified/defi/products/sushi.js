const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x7375736869000000000000000000000000000000000000000000000000000000',
  productName: 'Sushi',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(70),
  tags: ['Smart Contract'],
  about: 'Sushi is a community-driven organization built to solve what might be called the “liquidity problem.” One could define this problem as the inability of disparate forms of liquidity to connect with markets in a decentralized way, and vice versa. While other solutions provide incrementally progressive advances toward solving the problem of liquidity, Sushi’s progress is intended to create a broader range of network effects. Rather than limiting itself to a single solution, Sushi intertwines many decentralized markets and instruments.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://sushi.com/',
    twitter: 'https://twitter.com/sushiswap',
    blog: 'https://sushichef.medium.com/',
    github: 'https://github.com/sushiswap',
    documentation: 'https://dev.sushi.com/'
  },
  resolutionSources: [
    'https://twitter.com/sushiswap',
    'https://sushichef.medium.com/',
    'https://twitter.com/neptunemutual'
  ]
}
