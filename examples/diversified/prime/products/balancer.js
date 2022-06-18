const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x62616c616e636572000000000000000000000000000000000000000000000000',
  productName: 'Balancer',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(80),
  tags: ['Ethereum', 'Smart Contract', 'Portfolio Management', 'Fundraising', 'Liquidity'],
  about: 'Balancer is a community-driven protocol, automated portfolio manager, liquidity provider, and price sensor that empowers decentralized exchange and the automated portfolio management of tokens on the Ethereum blockchain and other EVM compatible systems.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://balancer.fi/',
    twitter: 'https://twitter.com/BalancerLabs',
    discord: 'https://discord.balancer.fi/',
    blog: 'https://medium.com/balancer-protocol',
    linkedin: 'https://www.linkedin.com/company/balancer-labs/',
    youtube: 'https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow',
    github: 'https://github.com/balancer-labs/'
  },
  resolutionSources: [
    'https://twitter.com/BalancerLabs',
    'https://medium.com/balancer-protocol',
    'https://twitter.com/neptunemutual'
  ]
}
