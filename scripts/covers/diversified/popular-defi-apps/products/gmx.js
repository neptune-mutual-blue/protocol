const { helper, key } = require('../../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('gmx-v1'),
  productName: 'GMX v1',
  requiresWhitelist: false,
  efficiency: helper.percentage(60),
  tags: ['perpetual', 'trade', 'dex', 'leverage', 'swap'],
  about: 'GMX is a permissionless, decentralized spot and perpetual swap exchange on the Arbitrum network.',
  blockchains: [{
    chainId: 1,
    name: 'Main Ethereum Network'
  },
  {
    chainId: 42161,
    name: 'Arbitrum'
  }],
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          'This policy relates exclusively to the GMX version 1 deployed on the Arbitrum and Ethereum blockchain (if available).',
          'To be eligible for a claim, policyholder must hold at least 299 NPM tokens in the wallet used for the policy transaction for the full duration of the cover policy.'
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
          'The loss must arise from one of the following blockchains: Arbitrum and Ethereum (if available).'
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
    website: 'https://gmx.io',
    app: 'https://app.gmx.io',
    twitter: 'https://twitter.com/GMX_IO',
    medium: 'https://medium.com/@gmx.io',
    github: 'https://github.com/gmx-io',
    telegram: 'https://t.me/GMX_IO',
    discord: 'https://discord.com/invite/ymN38YefH9'
  },
  resolutionSources: [
    {
      text: 'GMX Blog',
      uri: 'https://medium.com/@gmx.io'
    },
    {
      text: 'GMX Twitter',
      uri: 'https://twitter.com/GMX_IO'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
