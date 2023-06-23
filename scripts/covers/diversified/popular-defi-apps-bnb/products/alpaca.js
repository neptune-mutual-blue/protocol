const { helper, key } = require('../../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('alpaca-v1'),
  productName: 'Alpaca Finance v1',
  requiresWhitelist: false,
  efficiency: helper.percentage(70),
  tags: ['lending', 'farming', 'loan', 'leverage', 'yield'],
  about: 'Alpaca Finance is a lending protocol allowing leveraged yield farming on BNB Smart Chain. It offers borrowers undercollateralized loans for leveraged yield farming positions. As a result, it amplifies the liquidity layer of integrated exchanges, improving their capital efficiency by connecting LP borrowers and lenders.',
  blockchains: [
    {
      chainId: 56,
      name: 'BNB Chain'
    }
  ],
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          'This policy relates exclusively to the Alpaca Finance v1 protocol deployed on the BNB Smart Chain.',
          'To be eligible for a claim, the policyholder must hold at least 499 NPM tokens in the wallet used for the policy transaction for the full duration of the cover policy.'
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
          'The loss must arise from one of the following blockchains: BNB Smart Chain (BSC) (Previously Binance Smart Chain).'
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
    website: 'https://www.alpacafinance.org/',
    docs: 'https://docs.alpacafinance.org/',
    app: 'https://app.alpacafinance.org/',
    twitter: 'https://twitter.com/AlpacaFinance',
    telegram: 'https://t.me/alpacafinance',
    discord: 'https://discord.com/invite/alpacafinance',
    blog: 'https://medium.com/alpaca-finance',
    youtube: 'https://www.youtube.com/channel/UC8xBPBPgRD-xe_ZfyOwV_Dg',
    reddit: 'https://www.reddit.com/r/AlpacaFinanceOfficial/',
    github: 'https://github.com/alpaca-finance/bsc-alpaca-contract'
  },
  resolutionSources: [
    {
      text: 'Alpaca Finance Twitter',
      uri: 'https://twitter.com/AlpacaFinance'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
