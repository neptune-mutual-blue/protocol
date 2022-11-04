const { helper, key } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('rpl-v1'),
  productName: 'Rocketpool v1',
  requiresWhitelist: false,
  efficiency: helper.percentage(90),
  tags: ['staking', 'yield'],
  about: 'Rocket Pool is a liquid staking service protocol that runs a network of decentralized nodes, to perform validation services for the Ethereum 2.0 blockchain. Its purpose is to provide users who do not possess the required minimum of ETH tokens to stake and earn yields.',
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
          'This policy relates exclusively to the Rocket Pool v1 deployed on the Ethereum blockchain.',
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
    website: 'https://rocketpool.net/',
    discord: 'https://discord.com/invite/rocketpool',
    blog: 'https://medium.com/rocket-pool',
    twitter: 'https://twitter.com/Rocket_Pool',
    github: 'https://github.com/rocket-pool',
    dao: 'https://dao.rocketpool.net/',
    youtube: 'https://www.youtube.com/rocketpool',
    reddit: 'https://www.reddit.com/r/rocketpool/'
  },
  resolutionSources: [
    {
      text: 'Rocket Pool Twitter',
      uri: 'https://twitter.com/Rocket_Pool'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
