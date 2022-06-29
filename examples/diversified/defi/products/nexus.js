const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x6e657875732d6d757475616c0000000000000000000000000000000000000000',
  productName: 'Nexus Mutual',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(90),
  tags: ['Smart Contract'],
  about: 'Nexus Mutual is a decentralised alternative to insurance. Nexus Mutual uses blockchain technology to create a risk sharing pool in the form of a mutual to return the power of insurance to the people. The platform is built on the Ethereum public chain. It allows anyone to become a member and purchase cover. It replaces the idea of a traditional insurance company because it is wholly owned by the members. The model encourages engagement as members will get economic incentives for participating in Risk Assessment, Claims Assessment and Governance.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://nexusmutual.io/',
    twitter: 'https://twitter.com/NexusMutual',
    blog: 'https://medium.com/nexus-mutual',
    documentation: 'https://nexusmutual.gitbook.io/docs/users/understanding-nexus-mutual',
    github: 'https://github.com/NexusMutual',
    discord: 'https://discord.com/invite/aQjkzW5',
    telegram: 'https://t.me/joinchat/K_g-fA-3CmFwXumCKQUXkw'
  },
  resolutionSources: [
    'https://twitter.com/NexusMutual',
    'https://twitter.com/neptunemutual'
  ]
}
