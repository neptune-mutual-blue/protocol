
const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x6b79626572000000000000000000000000000000000000000000000000000000',
  productName: 'Kyber',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(50),
  tags: ['Smart Contract', 'Trading', 'DEX', 'Staking'],
  about: 'Kyber Network is a multi-chain crypto trading and liquidity hub that connects liquidity from different sources to enable trades at the best rates .',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://kyber.network/',
    documentation: 'https://docs.kyberswap.com/introduction',
    github: 'https://github.com/KyberNetwork',
    dao: 'https://kyber.org/vote',
    forum: 'https://gov.kyber.org/',
    discord: 'https://discord.com/invite/NB3vc8J9uv',
    telegram: 'https://t.me/kybernetwork',
    twitter: 'https://twitter.com/kybernetwork/',
    youtube: 'https://www.youtube.com/channel/UCQ-8mEqsKM3x9dTT6rrqgJw',
    blog: 'https://blog.kyber.network/'
  },
  resolutionSources: [
    'https://twitter.com/kybernetwork/',
    'https://twitter.com/neptunemutual'
  ]
}
