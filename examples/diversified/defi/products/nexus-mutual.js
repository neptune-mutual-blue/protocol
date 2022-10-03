const { helper, key } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('nexus-mutual-v1'),
  productName: 'Nexus Mutual (v1)',
  requiresWhitelist: false,
  efficiency: helper.percentage(90),
  tags: ['insurance', 'cover'],
  about: 'Nexus Mutual is a decentralised alternative to insurance. Nexus Mutual uses blockchain technology to create a risk sharing pool in the form of a mutual to return the power of insurance to the people. The platform is built on the Ethereum public chain. It allows anyone to become a member and purchase cover. It replaces the idea of a traditional insurance company because it is wholly owned by the members. The model encourages engagement as members will get economic incentives for participating in Risk Assessment, Claims Assessment and Governance.',
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          'This policy relates exclusively to the Nexus Mutual v1 contracts deployed on the Ethereum blockchain.',
          'To be eligible for a claim, policyholder must hold at least 10 NPM tokens in the wallet used for the policy transaction for the full duration of the cover policy.'
        ]
      }
    },
    {
      parameter: 'Cover Parameters',
      type: 'parameter',
      text: 'All of the following parameters must be applicable for the policy to be validated:',
      list: {
        type: 'ordered',
        items: [
          'Minimum total loss of user funds from the reported incident should exceed $5 million.',
          'The designated protocol suffers a hack of user funds in which the user funds are permanently and irrecoverably stolen from the protocol.',
          'The loss arises from a smart contract vulnerability.',
          'The loss must arise from one of the following blockchains: Ethereum.'
        ]
      }
    },
    {
      parameter: 'Cover Exclusions',
      type: 'exclusion',
      list: {
        type: 'ordered',
        items: [
          'Incident on any blockchain that is not supported by this cover.',
          'Frontend, hosting, server or network infrastructure, database, DNS server, CI/CD, and/or supply-chain attacks.',
          'All exclusions present in the standard terms and conditions.'
        ]
      }
    }
  ],
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
