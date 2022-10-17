const { helper, key } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('aave-v2'),
  productName: 'Aave Ethereum Market v2',
  requiresWhitelist: false,
  efficiency: helper.percentage(100),
  tags: ['borrowing', 'loan', 'interest', 'interest-bearing', 'lending', 'yield', 'staking'],
  about: 'Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.',
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          'This policy relates exclusively to the AAVE v2 protocol deployed on the Ethereum blockchain.',
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
    // {
    //   parameter: 'Contracts Covered',
    //   type: 'contract',
    //   list: {
    //     type: 'ordered',
    //     contracts: [
    //       {
    //         name: '',
    //         address: ''
    //       }
    //     ]
    //   }
    // }
  ],
  links: {
    website: 'https://aave.com/',
    documentation: 'https://docs.aave.com/',
    twitter: 'https://twitter.com/aaveaave',
    github: 'https://github.com/aave',
    discord: 'https://discord.com/invite/CvKUrqM',
    telegram: 'https://t.me/Aavesome',
    blog: 'https://medium.com/aave',
    linkedin: ''
  },
  resolutionSources: [
    'https://twitter.com/aaveaave',
    'https://medium.com/aave',
    'https://twitter.com/neptunemutual'
  ]
}
