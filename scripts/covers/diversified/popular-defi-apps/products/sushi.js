const { helper, key } = require('../../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('sushiswap-v1'),
  productName: 'Sushiswap',
  requiresWhitelist: false,
  efficiency: helper.percentage(50),
  tags: ['exchange', 'dex', 'swap', 'nft'],
  about: 'Sushiswap is  an automated market maker (AMM), in addition to facilitating market making for LPs and traders, Sushiswap also offers token vaults for lending & borrowing.',
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
          'This policy relates exclusively to the version 1 version of the (Swap) protocol deployed on the Ethereum and Arbitrum blockchain.',
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
    website: 'https://sushi.com/',
    twitter: 'https://twitter.com/sushiswap',
    blog: 'https://sushichef.medium.com/',
    github: 'https://github.com/sushiswap',
    documentation: 'https://dev.sushi.com/'
  },
  resolutionSources: [
    {
      text: 'Sushi Blog',
      uri: 'https://sushichef.medium.com'
    },
    {
      text: 'Sushi Twitter',
      uri: 'https://twitter.com/sushiswap'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
