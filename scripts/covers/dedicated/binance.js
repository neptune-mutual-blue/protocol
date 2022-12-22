const { key, helper } = require('../../../util')
const { ether, percentage } = helper

const DAYS = 86400

module.exports = {
  coverKey: key.toBytes32('binance'),
  coverName: 'Binance Exchange Custody',
  projectName: null,
  tokenName: 'Yield Bearing USDC',
  tokenSymbol: 'iUSDC-BNB',
  requiresWhitelist: false,
  supportsProducts: false,
  leverageFactor: '1',
  tags: ['exchange', 'cex', 'bnb', 'binance'],
  about: 'Founded in 2017 Binance is by far the largest centralized crypto exchange ranked by daily volume traded. Users can trade spots, futures and derivatives via its online platform and mobile app. Centralized exchanges operate order books and take custody of users assets to facilitate trading, it also facilitates lending and borrowing as well as other services such as staking to its user base.',
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
          'The designated exchange platform suffers a security breach of its hot or cold wallets where the minimum total loss of funds exceeds $50M',
          'Or the exchange halts all asset withdrawals for all users for more than 15 days except for Legitimate Reasons as defined under the Standard Terms and Conditions. In this case, incident report cannot be submitted until the expiry of the 15-day withdrawal-halt period. No policy could be purchased after withdrawal halt by the exchange and if any such policy purchased after withdrawal halt will be deemed invalid. Any policies that are expired prior to the end of the 15-day withdrawal-halt period will not be eligible for payout'
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
  ceiling: percentage(16),
  reportingPeriod: 7 * DAYS,
  cooldownPeriod: 1 * DAYS,
  claimPeriod: 7 * DAYS,
  minStakeToReport: ether(50_000),
  stakeWithFee: ether(30_000),
  initialReassuranceAmount: '0',
  reassuranceRate: percentage(25),
  links: {
    website: 'https://binance.com/',
    discord: 'https://discord.com/invite/jE4wt8g2H2',
    blog: 'https://www.binance.com/en/blog',
    tiktok: 'https://www.tiktok.com/@binance?lang=en',
    facebook: 'https://www.facebook.com/binance',
    twitter: 'https://twitter.com/binance',
    reddit: 'https://www.reddit.com/r/binance/',
    instagram: 'https://www.instagram.com/Binance/',
    coinmarketcap: 'https://coinmarketcap.com/exchanges/binance/',
    youtube: 'https://www.youtube.com/binanceyoutube'
  },
  resolutionSources: [
    {
      text: 'Binance Twitter',
      uri: 'https://twitter.com/binance'
    },
    {
      text: 'Neptune Mutual Twitter',
      uri: 'https://twitter.com/neptunemutual'
    }
  ]
}
