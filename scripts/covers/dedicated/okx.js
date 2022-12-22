const { key, helper } = require('../../../util')
const { ether, percentage } = helper

const DAYS = 86400

module.exports = {
  coverKey: key.toBytes32('okx'),
  coverName: 'OKX Exchange Custody',
  projectName: null,
  tokenName: 'Yield Bearing USDC',
  tokenSymbol: 'iUSDC-OKX',
  requiresWhitelist: false,
  supportsProducts: false,
  leverageFactor: '1',
  tags: ['exchange', 'cex', 'okx', 'okb', 'okex'],
  about: 'Founded in 2017, OKX is a rebrand from the former OKEX exchange, it is one of the leading global crypto exchanges,  particularly with strong derivatives trading volume. Users can trade spots, futures and derivatives via its online platform and mobile app. Centralized exchanges operate order books and take custody of users assets to facilitate trading, it also facilitates lending and borrowing as well as other services such as staking to its user base.',
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          'This policy relates exclusively to the core exchange platform serving global users outside of the US and US territories (not any other apps listed on the platform)',
          'To be eligible for a claim, policyholders must hold at least 100 NPM tokens in the wallet used for the policy transaction for the full duration of the cover policy'
        ]
      }
    },
    {
      parameter: 'Cover Parameters',
      type: 'parameter',
      text: 'One of the following parameters must be applicable for the policy to be validated:',
      list: {
        type: 'ordered',
        items: [
          'The designated exchange platform suffers a security breach of its hot or cold wallets where the minimum total loss of  funds exceeds $50M',
          'Or the exchange halts all asset withdrawals for all users for more than 15 days except for Legitimate Reasons as defined under the Standard Terms and Conditions.  In this case, incident report cannot be submitted until the expiry of the 15-day withdrawal-halt period. No policy could be purchased after withdrawal halt by the exchange and if any such policy purchased after withdrawal halt will be deemed invalid.  Any policies that are expired prior to the end of the 15-day withdrawal-halt period will not be eligible for payout'
        ]
      }
    },
    {
      parameter: 'Cover Exclusions',
      type: 'exclusion',
      list: {
        type: 'unordered',
        items: [
          'All exclusions present in the standard terms and exclusions'
        ]
      }
    }
  ],
  blockchains: null,
  floor: percentage(0.5),
  ceiling: percentage(7),
  reportingPeriod: 7 * DAYS,
  cooldownPeriod: 1 * DAYS,
  claimPeriod: 7 * DAYS,
  minStakeToReport: ether(50_000),
  stakeWithFee: ether(30_000),
  initialReassuranceAmount: '0',
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
