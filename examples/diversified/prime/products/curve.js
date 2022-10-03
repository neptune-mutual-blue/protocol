const { helper, key } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('curve-v2'),
  productName: 'Curve Finance (v2)',
  requiresWhitelist: false,
  efficiency: helper.percentage(70),
  tags: ['dex', 'exchange', 'swap', 'stablecoin'],
  about: 'Curve is an automated market maker (AMM), The main difference between Curve and other DEXes is that Curve focuses mainly on stablecoins trading. Thereby improving capital efficiency and reducing slippage. The release of its V2 since June 2021, also allows trading of non-pegged assets in a more concentrated liquidity fashion whilst still allowing LP to passively provide liquidity without specifying a price range.',
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          'This policy relates exclusively to the Curve v2 protocol deployed on the Ethereum blockchain.',
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
    website: 'https://curve.fi/',
    twitter: 'https://twitter.com/CurveFinance',
    telegram: 'https://t.me/curvefi',
    discord: 'https://discord.com/invite/9uEHakc',
    documentation: 'https://resources.curve.fi/',
    github: 'https://github.com/curvefi'

  },
  resolutionSources: [
    'https://twitter.com/CurveFinance',
    'https://news.curve.fi/',
    'https://twitter.com/neptunemutual'
  ]
}
