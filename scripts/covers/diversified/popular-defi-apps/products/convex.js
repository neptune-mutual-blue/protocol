const { helper, key } = require('../../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('convex-v1'),
  productName: 'Convex (Curve)',
  requiresWhitelist: false,
  efficiency: helper.percentage(50),
  tags: ['curve', 'staking', 'yield'],
  about: 'Convex Finance is a platform for CRV token holders and Curve LPs to earn additional interest and  trading fees.',
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
          'This policy relates exclusively to the version 1 version of the protocol (Convex/Curve) deployed on the Ethereum and Arbitrum blockchain.',
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
          'The loss must arise from one of the following blockchains: Ethereum and Arbitrum.'
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
    website: 'https://www.convexfinance.com',
    docs: 'https://docs.convexfinance.com/',
    blog: 'https://convexfinance.medium.com',
    twitter: 'https://twitter.com/ConvexFinance',
    discord: 'https://discord.com/invite/TTEVTqY488',
    telegram: 'https://t.me/convexEthChat'
  },
  resolutionSources: [
    {
      text: 'Convex Twitter',
      uri: 'https://twitter.com/ConvexFinance'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
