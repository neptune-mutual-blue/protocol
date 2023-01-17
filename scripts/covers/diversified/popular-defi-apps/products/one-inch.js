const { helper, key } = require('../../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('oneinch-v2'),
  productName: '1inch v2',
  requiresWhitelist: false,
  efficiency: helper.percentage(40),
  tags: ['exchange', 'dex', 'swap', 'aggregation'],
  about: 'The 1inch Network unites decentralized protocols whose synergy enables the most lucrative, fastest, and protected operations in the DeFi space by offering access to hundreds of liquidity sources across multiple chains. The 1inch Network was launched at the ETHGlobal New York hackathon in May 2019 with the release of its Aggregation Protocol v1. Since then, 1inch Network has developed additional DeFi tools such as the Liquidity Protocol, Limit Order Protocol, P2P transactions, and 1inch Mobile Wallet.',
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
          'This policy relates exclusively to the 1inch v2 protocol deployed on the Ethereum blockchain.',
          'To be eligible for a claim, policyholder must hold at least 49 NPM tokens in the wallet used for the policy transaction for the full duration of the cover policy.'
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
    website: 'https://1inch.io/',
    twitter: 'https://twitter.com/1inch',
    blog: 'https://blog.1inch.io/',
    documentation: 'https://docs.1inch.io/',
    reddit: 'https://www.reddit.com/r/1inch/',
    discord: 'https://discord.com/invite/1inch',
    youtube: 'https://www.youtube.com/channel/UCk0nvK4bHpteQXZKv7lkq5w',
    telegram: 'https://t.me/OneInchNetwork',
    github: 'https://github.com/1inch'
  },
  resolutionSources: [
    {
      text: '1inch Blog',
      uri: 'https://blog.1inch.io/'
    },
    {
      text: '1inch Twitter',
      uri: 'https://twitter.com/1inch'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
