const { helper, key } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('uniswap-v3'),
  productName: 'Uniswap (v3)',
  requiresWhitelist: false,
  efficiency: helper.percentage(90),
  tags: ['exchange', 'dex', 'swap', 'flashloan', 'nft'],
  about: 'The Key difference of UniswapV3 compared to V2 is “concentrated liquidity”,  allowing LPs to control the price range in which their assets get traded. To reduce slippage and improve capital efficiency. V3 is released in May 2021.',
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          'This policy relates exclusively to the Uniswap v3 protocol deployed on the Ethereum blockchain.',
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
    website: 'https://uniswap.org/',
    app: 'https://app.uniswap.org/#/swap',
    twitter: 'https://twitter.com/Uniswap',
    blog: 'https://uniswap.org/blog',
    discord: 'https://discord.com/invite/FCfyBSbCU5',
    github: 'https://github.com/Uniswap',
    docs: 'https://docs.uniswap.org/protocol/introduction'
  },
  resolutionSources: [
    'https://twitter.com/Uniswap',
    'https://uniswap.org/blog',
    'https://twitter.com/neptunemutual'
  ]
}
