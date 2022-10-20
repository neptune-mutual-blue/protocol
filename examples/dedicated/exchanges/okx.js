const { key, helper } = require('../../../util')
const { ether, percentage, STABLECOIN_DECIMALS } = helper

const MINUTES = 60
const PRECISION = STABLECOIN_DECIMALS

module.exports = {
  coverKey: key.toBytes32('okx'),
  coverName: 'OKX',
  projectName: null,
  tokenName: 'Income Bearing DAI',
  tokenSymbol: 'iDAI-OKX',
  requiresWhitelist: false,
  supportsProducts: false,
  leverageFactor: '1',
  tags: ['exchange', 'cex', 'okx', 'okex'],
  about: 'Founded in 2017, OKX is a rebrand from the former OKEX exchange, it is one of the leading global crypto exchanges,  particularly with strong derivatives trading volume. Users can trade spots, futures and derivatives via its online platform and mobile app. Centralized exchanges operate order books and take custody of users assets to facilitate trading, it also facilitates lending and borrowing as well as other services such as staking to its user base.',
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          'This policy relates exclusively to the core exchange platform serving global users (outside of US and US territories).',
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
          'Minimum total loss of user funds should exceed $50 million.',
          'OKX suffers a security breach of its hot or cold wallets where the user funds are permanently and irrecoverably stolen from OKX.',
          'The loss must arise from security incidents of the crypto storage systems'
        ]
      }
    },
    {
      parameter: 'Cover Exclusions',
      type: 'exclusion',
      list: {
        type: 'ordered',
        items: [
          'Losses arisen due to issues with fork, merge,  any other changes of relevant underlying blockchains',
          'Losses resulting from Key man risk where a single person controls access to the user funds at the custodian, is not covered.',
          'Frontend, hosting, server or network infrastructure, database, DNS server, CI/CD, and/or supply-chain attacks.',
          'All exclusions present in the standard terms and exclusions'
        ]
      }
    }
  ],
  blockchains: null,
  floor: percentage(4),
  ceiling: percentage(16),
  reportingPeriod: 5 * MINUTES,
  cooldownPeriod: 5 * MINUTES,
  claimPeriod: 5 * MINUTES,
  minStakeToReport: ether(2000),
  stakeWithFee: ether(2000),
  initialReassuranceAmount: ether(50_000, PRECISION),
  reassuranceRate: percentage(25),
  links: {
    website: 'https://www.okx.com/',
    telegram: 'https://t.me/OKXOfficial_English',
    twitter: 'https://twitter.com/okx',
    blog: 'https://www.okx.com/academy/en/category/Press-en',
    instagram: 'https://www.instagram.com/okx_official/',
    youtube: 'https://www.youtube.com/channel/UCZEp9q993DknUPrhIL51lcw',
    discord: 'https://discord.com/invite/e6EyvM5QwM',
    linkedin: 'https://www.linkedin.com/company/okxofficial/'
  },
  resolutionSources: [
    {
      text: 'OKX Twitter',
      uri: 'https://twitter.com/okx'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
