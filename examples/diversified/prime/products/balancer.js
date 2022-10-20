const { helper, key } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('balancer-v2'),
  productName: 'Balancer v2',
  requiresWhitelist: false,
  efficiency: helper.percentage(75),
  tags: ['exchange', 'swap', 'dex', 'launchpad', 'flashloan'],
  about: 'Balancer is an automated market maker (AMM ) that allows LPs to deposit more types of tokens to liquidity pools instead of a pair, also gives more flexibility for LP creator to customize trading fees or create private pools. With the launch of V2 (since May 2021) the single Vault architecture separates the token accounting and management from the Pool logic, hence assets can shift around without emitting an ERC20 transfer event on-chain improving gas efficiency for traders.',
  blockchains: [{
    chainId: 1,
    name: 'Main Ethereum Network'
  }],
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          'This policy relates exclusively to the Balancer V2 deployed on the Ethereum blockchain.',
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
          'Minimum total loss of user funds should exceed $5 million.',
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
          'All exclusions present in the standard terms and exclusions.'
        ]
      }
    }
  ],
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
    {
      text: 'Balancer Blog',
      uri: 'https://medium.com/balancer-protocol'
    },
    {
      text: 'Balancer Twitter',
      uri: 'https://twitter.com/BalancerLabs'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
