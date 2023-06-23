const { helper, key } = require('../../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.coverKey,
  productKey: key.toBytes32('dodo-v2'),
  productName: 'DODO v2',
  requiresWhitelist: false,
  efficiency: helper.percentage(70),
  tags: ['amm', 'dex', 'pmm', 'liquidity'],
  about: 'DODO is a DeFi  protocol and on-chain liquidity provider that differentiates itself with a proactive market maker (PMM) algorithm, with the aim to offer better liquidity and price stability compared to the AMM (automated market maker) models.  The PMM algorithm mimics human trading, utilizes oracles to gather market prices, then provides liquidity close to these prices in order to stabilize the portfolios for liquidity providers (LP).',
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
          'This policy relates exclusively to the DODO v2 protocol deployed on the BNB Smart Chain.',
          'To be eligible for a claim, the policyholder must hold at least 399 NPM tokens in the wallet used for the policy transaction for the full duration of the cover policy.'
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
    website: 'https://dodoex.io',
    app: 'https://app.dodoex.io',
    docs: 'https://docs.dodoex.io',
    github: 'https://github.com/DODOEX',
    telegram: 'https://t.me/dodoex_official',
    twitter: 'https://twitter.com/BreederDodo',
    discord: 'https://discord.gg/tyKReUK',
    community: 'https://community.dodoex.io/'
  },
  resolutionSources: [
    {
      text: 'DODO Twitter',
      uri: 'https://twitter.com/BreederDodo'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
