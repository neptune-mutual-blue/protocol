const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x636861696e6c696e6b0000000000000000000000000000000000000000000000',
  productName: 'Chainlink',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(90),
  tags: ['Ethereum', 'Smart Contract', 'Oracle'],
  about: 'Chainlink decentralized oracle networks provide tamper-proof inputs, outputs, and computations to support advanced smart contracts on any blockchain.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://chain.link/',
    twitter: 'https://twitter.com/chainlink',
    blog: 'https://blog.chain.link/',
    youtube: 'https://www.youtube.com/channel/UCnjkrlqaWEBSnKZQ71gdyFA',
    discord: 'https://discord.com/invite/chainlink',
    telegram: 'https://t.me/chainlinkofficial',
    reddit: 'https://www.reddit.com/r/Chainlink/',
    kakao: 'https://open.kakao.com/o/gWXAAf0b'
  },
  resolutionSources: [
    'https://twitter.com/chainlink',
    'https://twitter.com/neptunemutual'
  ]
}
