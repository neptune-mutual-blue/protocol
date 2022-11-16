const { helper, key } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('maker-v1'),
  productName: 'Maker DAO MCD v1',
  requiresWhitelist: false,
  efficiency: helper.percentage(90),
  tags: ['lending', 'borrowing', 'stablecoin', 'yield', 'staking', 'payment'],
  about: 'MakerDAO is a decentralized organization dedicated to bringing stability to the cryptocurrency economy. The Maker Protocol employs a two-token system. The first being, Dai, a collateral-backed stablecoin that offers stability. The Maker Foundation and the MakerDAO community believe that a decentralized stablecoin is required to have any business or individual realize the advantages of digital money. Second, there is MKR, a governance token that is used by stakeholders to maintain the system and manage Dai. MKR token holders are the decision-makers of the Maker Protocol, supported by the larger public community and various other external parties.',
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
          'This policy relates exclusively to Version 1 of the Maker DAO (Multi-Collateral DAI) smart contracts deployed on the Ethereum blockchain.',
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
    website: 'https://makerdao.com/',
    twitter: 'https://twitter.com/MakerDAO',
    blog: 'https://medium.com/@MakerDAO',
    documentation: 'https://docs.makerdao.com/',
    reddit: 'https://www.reddit.com/r/MakerDAO/',
    telegram: 'https://t.me/makerdaoOfficial',
    discord: 'https://discord.com/invite/RBRumCpEDH',
    youtube: 'https://www.youtube.com/MakerDAO'
  },
  resolutionSources: [
    {
      text: 'MakerDAO Blog',
      uri: 'https://medium.com/@MakerDAO'
    },
    {
      text: 'MakerDAO Twitter',
      uri: 'https://twitter.com/MakerDAO'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
