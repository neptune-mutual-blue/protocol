const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x756e69737761702d763200000000000000000000000000000000000000000000',
  productName: 'Uniswap V2',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(90),
  tags: ['Smart Contract'],
  about: 'The Uniswap protocol is a peer-to-peer system designed for exchanging cryptocurrencies (ERC-20 Tokens) on the Ethereum blockchain. The protocol is implemented as a set of persistent, non-upgradable smart contracts; designed to prioritize censorship resistance, security, self-custody, and to function without any trusted intermediaries who may selectively restrict access.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://uniswap.org/',
    twitter: 'https://twitter.com/Uniswap',
    blog: 'https://uniswap.org/blog',
    discord: 'https://discord.com/invite/FCfyBSbCU5',
    github: 'https://github.com/Uniswap'
  },
  resolutionSources: [
    'https://twitter.com/Uniswap',
    'https://uniswap.org/blog',
    'https://twitter.com/neptunemutual'
  ]
}
