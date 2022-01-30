const { ether } = require('../util/helper')
const { minutesToBlocks } = require('../util/block-time')

const MINUTES = 60

const covers = [
  {
    coverName: 'Coinbase Cover',
    projectName: 'Coinbase',
    key: '0x636f696e62617365000000000000000000000000000000000000000000000000', // toBytes32('coinbase')
    reportingPeriod: 30 * MINUTES,
    resolutionSources: [
      'https://twitter.com/coinbase',
      'https://blog.coinbase.com/',
      'https://twitter.com/neptunemutual'
    ],
    reassurance: ether(20_000),
    stakeWithFees: ether(50_000),
    initialLiquidity: ether(50_000),
    minReportingStake: ether(500),
    about:
      'Coinbase is a secure online platform for buying, selling, transferring, and storing cryptocurrency.',
    tags: ['Smart Contract', 'DeFi', 'Exchange'],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
    3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
    4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
    links: {
      website: 'https://www.coinbase.com/',
      documentation: 'https://developers.coinbase.com/api/v2',
      telegram: null,
      twitter: 'https://twitter.com/coinbase',
      github: 'https://github.com/coinbase',
      facebook: 'https://www.facebook.com/Coinbase',
      blog: 'https://blog.coinbase.com/',
      discord: 'https://discord.com/invite/APpF8aZ',
      linkedin: 'https://www.linkedin.com/company/coinbase/',
      slack: null
    }
  },
  {
    coverName: 'Hex Trust Cover',
    projectName: 'Hex Trust',
    key: '0x6865782d74727573740000000000000000000000000000000000000000000000', // toBytes32('hex-trust')
    reportingPeriod: 30 * MINUTES,
    resolutionSources: [
      'https://twitter.com/Hex_Trust',
      'https://medium.com/hex-trust',
      'https://twitter.com/neptunemutual'
    ],
    reassurance: ether(150_000),
    stakeWithFees: ether(50_000),
    initialLiquidity: ether(50_000),
    minReportingStake: ether(500),
    about:
      'Hex Trust is fully licensed, insured, and the leading provider of bank-grade custody for digital assets. ',
    tags: ['Smart Contract', 'DeFi', 'Custody'],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
    3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
    4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
    links: {
      website: 'https://hextrust.com/',
      documentation: null,
      telegram: null,
      twitter: 'https://twitter.com/Hex_Trust',
      github: 'https://github.com/hextrust',
      facebook: null,
      blog: 'https://medium.com/hex-trust',
      discord: null,
      linkedin: 'https://hk.linkedin.com/company/hextrust',
      slack: null
    }
  },
  {
    coverName: 'OKEx Cover',
    projectName: 'OKEx',
    key: '0x6f6b000000000000000000000000000000000000000000000000000000000000', // toBytes32('ok')
    reportingPeriod: 30 * MINUTES,
    resolutionSources: [
      'https://twitter.com/OKEx',
      'https://medium.com/okex-blog',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn OKB',
      settings: {
        3: {
          rewardToken: '0x1DC3318aaAfE76BC825365DcF3518B83e2137894',
          uniRewardTokenDollarPair: '0x688C2D6183b4e8669cE6814aB63860d565701157',
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.020),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(30_000)
        },
        31337: {
          rewardToken: '0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00',
          uniRewardTokenDollarPair: '0xF8e31cb472bc70500f08Cd84917E5A1912Ec8397',
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.020),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(30_000)
        },
        42: {
          rewardToken: '0x20B69b8a65B235d1FDA63B074Dc8e0E74bb35e19',
          uniRewardTokenDollarPair: '0x6677357FeB48BD397EBf68146931631721b817f0',
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.020),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(30_000)
        }
      }
    },
    reassurance: ether(30_000),
    stakeWithFees: ether(50_000),
    initialLiquidity: ether(50_000),
    minReportingStake: ether(500),
    about:
      'OKEx is a Seychelles-based cryptocurrency exchange that provides a platform for trading various cryptocurrencies.',
    tags: ['Smart Contract', 'DeFi', 'Exchange'],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
    3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
    4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
    links: {
      website: 'https://www.okex.com/',
      documentation: 'https://www.okex.com/docs-v5/en/',
      telegram: 'https://t.me/OKExOfficial_English',
      twitter: 'https://twitter.com/OKEx',
      github: 'https://github.com/okex',
      facebook: 'https://www.facebook.com/okexofficial',
      blog: 'https://medium.com/okex-blog',
      discord: 'https://discord.com/invite/sanS9FuGV4',
      linkedin: 'https://www.linkedin.com/company/okex/',
      slack: null
    }
  },
  {
    coverName: 'Huobi Cover',
    projectName: 'Huobi',
    key: '0x68756f6269000000000000000000000000000000000000000000000000000000', // toBytes32('huobi')
    reportingPeriod: 30 * MINUTES,
    resolutionSources: [
      'https://twitter.com/HuobiGlobal',
      'https://huobiglobal.medium.com/',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn HT',
      settings: {
        3: {
          rewardToken: '0xe2e3cAA55dEdb93f802B16314B4579c9a57d3B0e',
          uniRewardTokenDollarPair: '0x6CAcF6146FFa792AAd797451Df5fCD5F3ace0470',
          stakingTarget: ether(1_000_000),
          maxStake: ether(25_000),
          rewardPerBlock: ether(0.025),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(25_000)
        },
        31337: {
          rewardToken: '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB',
          uniRewardTokenDollarPair: '0xD5ac451B0c50B9476107823Af206eD814a2e2580',
          stakingTarget: ether(1_000_000),
          maxStake: ether(25_000),
          rewardPerBlock: ether(0.025),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(25_000)
        },
        42: {
          rewardToken: '0x921e65d8A0F071caa170efD316Cd1bc2bf6225e0',
          uniRewardTokenDollarPair: '0x9166bE80b9C647d4370a73ae1f58E93904A9AfBb',
          stakingTarget: ether(1_000_000),
          maxStake: ether(25_000),
          rewardPerBlock: ether(0.025),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(25_000)
        }
      }
    },
    reassurance: ether(10_000),
    stakeWithFees: ether(20_000),
    initialLiquidity: ether(50_000),
    minReportingStake: ether(500),
    about: 'Huobi is a Seychelles-based cryptocurrency exchange.',
    tags: ['Exchange', 'DeFi', 'Exchange'],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
    3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
    4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
    links: {
      website: 'https://www.huobi.com/en-us/',
      documentation:
        'https://docs.huobigroup.com/docs/option/v1/en/#introduction',
      telegram: 'https://t.me/huobiglobalofficial',
      twitter: 'https://twitter.com/HuobiGlobal',
      github: 'https://github.com/huobiapi',
      facebook: 'https://www.facebook.com/huobiglobalofficial',
      blog: 'https://huobiglobal.medium.com/',
      discord: 'https://discord.com/invite/xrAq7Fv7Xx',
      linkedin: 'https://www.linkedin.com/company/huobi/',
      slack: null
    }
  },
  {
    coverName: 'Axie',
    projectName: 'Axie',
    key: '0x6178696500000000000000000000000000000000000000000000000000000000', // toBytes32('axie')
    reportingPeriod: 30 * MINUTES,
    resolutionSources: [
      'https://twitter.com/axieinfinity',
      'https://axie.substack.com/',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn AXIE',
      settings: {
        3: {
          rewardToken: '0xaBccBfdfd5Ff2855236C371D70Dc7951a3F3ba5B',
          uniRewardTokenDollarPair: '0x2519c7E52ccFA72f306a4907e5f727F189cb9F05',
          stakingTarget: ether(5_000_000),
          maxStake: ether(50_000),
          rewardPerBlock: ether(0.050),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(15_000)
        },
        31337: {
          rewardToken: '',
          uniRewardTokenDollarPair: '',
          stakingTarget: ether(5_000_000),
          maxStake: ether(50_000),
          rewardPerBlock: ether(0.050),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(15_000)
        },
        42: {
          rewardToken: '0x6575efCb04306Af46414e0425162a54734B9e024',
          uniRewardTokenDollarPair: '0x1fB7a7046D5e1b2DfA8b2169456bEb0Acc04F7ed',
          stakingTarget: ether(5_000_000),
          maxStake: ether(50_000),
          rewardPerBlock: ether(0.050),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(15_000)
        }
      }
    },
    reassurance: ether(10_000),
    stakeWithFees: ether(50_000),
    initialLiquidity: ether(50_000),
    minReportingStake: ether(500),
    about:
      'Axie Infinity is an NFT-based online video game developed by Vietnamese studio Sky Mavis, which uses Ethereum-based cryptocurrencies, Axie Infinity Shards and Smooth Love Potion.',
    tags: ['Smart Contract', 'NFT', 'Gaming'],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
    3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
    4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
    links: {
      website: 'https://axieinfinity.com/',
      documentation: 'https://whitepaper.axieinfinity.com/',
      telegram: null,
      twitter: 'https://twitter.com/axieinfinity',
      github: 'https://github.com/axieinfinity',
      facebook: 'https://www.facebook.com/AxieInfinity',
      blog: 'https://axie.substack.com/',
      discord: 'https://discord.com/invite/axie',
      linkedin: 'https://www.linkedin.com/company/axieinfinity/',
      slack: null
    }
  },
  {
    coverName: 'Clearpool Cover',
    projectName: 'Clearpool',
    key: '0x63706f6f6c000000000000000000000000000000000000000000000000000000', // toBytes32('cpool')
    reportingPeriod: 1 * MINUTES,
    resolutionSources: [
      'https://twitter.com/ClearpoolFin',
      'https://clearpool.medium.com/',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn CPOOL',
      settings: {
        3: {
          rewardToken: '0x9912B6Fc42675DC940313551b20c022219b98Adb',
          uniRewardTokenDollarPair: '0xa3831BdDba111773dc9919007E322A36003ed7E8',
          stakingTarget: ether(10_000_000),
          maxStake: ether(90_000),
          rewardPerBlock: ether(0.080),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(70_000)
        },
        31337: {
          rewardToken: '',
          uniRewardTokenDollarPair: '',
          stakingTarget: ether(10_000_000),
          maxStake: ether(90_000),
          rewardPerBlock: ether(0.080),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(200_000)
        },
        42: {
          rewardToken: '0x0094C12E7acb84E999C5c69746C48F8D51d836ca',
          uniRewardTokenDollarPair: '0x366e82434f1108Ec7ecD7C73408d9ba71F1d0589',
          stakingTarget: ether(10_000_000),
          maxStake: ether(90_000),
          rewardPerBlock: ether(0.080),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(70_000)
        }
      }
    },
    reassurance: ether(50_000),
    stakeWithFees: ether(50_000),
    initialLiquidity: ether(50_000),
    minReportingStake: ether(500),
    about:
      'Clearpool takes core concepts from traditional credit markets, and applies the principles of decentralization to create a decentralized capital markets ecosystem.',
    tags: ['Smart Contract', 'Borrowing', 'Lending'],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
    3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
    4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
    links: {
      website: 'https://clearpool.finance/',
      documentation: 'https://docs.clearpool.finance/resources/documents',
      telegram: 'https://t.me/clearpoolofficial',
      twitter: 'https://twitter.com/ClearpoolFin',
      github: null,
      facebook: null,
      blog: 'https://clearpool.medium.com/',
      discord: null,
      linkedin: null,
      slack: null
    }
  }
]

module.exports = { covers }
