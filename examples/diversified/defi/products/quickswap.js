const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x717569636b737761700000000000000000000000000000000000000000000000',
  productName: 'Quickswap',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(50),
  tags: ['Smart Contract'],
  about: 'Quickswap is an automated liquidity protocol powered by a constant product formula and implemented in a system of non-upgradeable smart contracts on the Ethereum blockchain. It obviates the need for trusted intermediaries, prioritizing decentralization, censorship resistance, and security. Quickswap is open-source software licensed under the GPL.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://quickswap.exchange',
    twitter: 'https://twitter.com/QuickswapDEX',
    blog: 'https://quickswap-layer2.medium.com/',
    documentation: 'https://docs.quickswap.exchange/',
    github: 'https://github.com/QuickSwap'
  },
  resolutionSources: [
    'https://twitter.com/QuickswapDEX',
    'https://twitter.com/neptunemutual'
  ]
}
