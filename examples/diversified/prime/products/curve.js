const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x6375727665000000000000000000000000000000000000000000000000000000',
  productName: 'Curve Finance',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(70),
  tags: ['Smart Contract'],
  about: 'Curve is DeFi\'s leading AMM, (Automated Market Maker).  Hundreds of liquidity pools have been launched through Curve\'s factory and incentivized by Curve\'s DAO.  Users rely on Curve\'s proprietary formulas to provide high liquidity, low slippage, low fee transactions among ERC-20 tokens.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://curve.fi/',
    twitter: 'https://twitter.com/CurveFinance',
    telegram: 'https://t.me/curvefi',
    discord: 'https://discord.com/invite/9uEHakc',
    documentation: 'https://resources.curve.fi/',
    github: 'https://github.com/curvefi'

  },
  resolutionSources: [
    'https://twitter.com/CurveFinance',
    'https://news.curve.fi/',
    'https://twitter.com/neptunemutual'
  ]
}
