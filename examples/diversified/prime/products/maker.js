const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x6d616b6572000000000000000000000000000000000000000000000000000000',
  productName: 'Maker DAO',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(90),
  tags: ['Smart Contract'],
  about: 'MakerDAO is a decentralized organization dedicated to bringing stability to the cryptocurrency economy. The Maker Protocol employs a two-token system. The first being, Dai, a collateral-backed stablecoin that offers stability. The Maker Foundation and the MakerDAO community believe that a decentralized stablecoin is required to have any business or individual realize the advantages of digital money. Second, there is MKR, a governance token that is used by stakeholders to maintain the system and manage Dai. MKR token holders are the decision-makers of the Maker Protocol, supported by the larger public community and various other external parties.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://makerdao.com/',
    twitter: 'https://twitter.com/MakerDAO',
    blog: 'https://medium.com/@MakerDAO',
    documentation: 'https://docs.makerdao.com/',
    reddit: 'https://www.reddit.com/r/MakerDAO/',
    telegram: 'https://t.me/makerdaoOfficial',
    discord: 'https://discord.com/invite/RBRumCpEDH',
    youtube: 'https://www.youtube.com/MakerDAO'
  },
  resolutionSources: [
    'https://twitter.com/MakerDAO',
    'https://medium.com/@MakerDAO',
    'https://twitter.com/neptunemutual'
  ]
}
