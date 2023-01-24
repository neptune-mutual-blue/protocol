const { helper, key } = require('../../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('dydx-v3'),
  productName: 'DYDX v3',
  requiresWhitelist: false,
  efficiency: helper.percentage(30),
  tags: ['exchange', 'dex', 'swap', 'derivatives', 'leverage'],
  about: 'dYdX is a crypto derivatives exchange that leverages a hybrid model utilizing non-custodial, on-chain settlement and an off-chain order books matching engine.',
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
          'This policy relates exclusively to the dYdX V3 protocol deployed on the StarkEx layer 2 blockchain running on top of Ethereum.',
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
          'The loss must arise from one of the following blockchains: StarkEx layer 2 blockchain running on top of Ethereum.'
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
    website: 'https://dydx.exchange',
    app: 'https://trade.dydx.exchange/',
    testnet: 'https://trade.stage.dydx.exchange/',
    docs: 'https://docs.dydx.exchange/',
    github: 'https://github.com/dydxprotocol/',
    blog: 'https://dydx.exchange/blog',
    support: 'https://help.dydx.exchange/en/',
    twitter: 'https://twitter.com/dydx',
    discord: 'https://discord.gg/Tuze6tY',
    youtube: 'https://www.youtube.com/c/dYdXprotocol',
    reddit: 'https://www.reddit.com/r/dydxprotocol',
    linkedin: 'https://linkedin.com/company/dydx'
  },
  resolutionSources: [
    {
      text: 'DYDX Blog',
      uri: 'https://dydx.exchange/blog'
    },
    {
      text: 'DYDX Twitter',
      uri: 'https://twitter.com/dydx'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
