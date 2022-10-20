const { helper, key } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('lrcex-v3'),
  productName: 'Loopring Exchange (v3)',
  requiresWhitelist: false,
  efficiency: helper.percentage(90),
  tags: ['dex', 'zk', 'zkrollup', 'swap', 'exchange'],
  about: 'Loopring Exchange is the dex built on top of the Loopring protocol which is a first zkrollup layer2 solution to scale Ethereum. Loopring Exchange is able to facilitate trade via order books instead of the common AMM  model adopted by popular dexes thanks to the lower gas fee and higher transaction speed.',
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
          'This policy relates exclusively to the Loopring Exchange v3 deployed on the Ethereum blockchain.',
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
    website: 'https://loopring.io/',
    app: 'https://loopring.io/#/trade',
    discord: 'https://discord.com/invite/KkYccYp',
    twitter: 'https://twitter.com/loopringorg',
    youtube: 'https://www.youtube.com/c/Loopring',
    blog: 'https://medium.loopring.io/',
    docs: 'https://docs.loopring.io/en/'
  },
  resolutionSources: [
    {
      text: 'Loopring Twitter',
      uri: 'https://twitter.com/loopringorg'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
