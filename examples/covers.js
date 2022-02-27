const { ether, percentage } = require('../util/helper')
const { minutesToBlocks } = require('../util/block-time')

const MINUTES = 60

const covers = [
  {
    key: '0x7874000000000000000000000000000000000000000000000000000000000000', // toBytes32('xt')
    coverName: 'XT Exchange Cover',
    projectName: 'XT Exchange',
    tags: ['Smart Contract', 'DeFi', 'Exchange'],
    about:
      'XT.COM is a comprehensive trading platform that supports 100+ high-quality currencies and 300 trading pairs. It has a rich variety of transactions such as currency transactions, leveraged transactions, OTC transactions, contract transactions, and credit card purchases. Provide users with the safest, most efficient and professional digital asset investment services.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.xt.com',
      documentation: 'https://doc.xt.com',
      twitter: 'https://twitter.com/XTexchange',
      blog: 'https://medium.com/@XT_com',
      discord: 'https://discord.gg/xp5fPuExXY',
      linkedin: 'https://www.linkedin.com/company/xt-com-exchange'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(5000),
    resolutionSources: [
      'https://twitter.com/XTexchange',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn XT',
      settings: {
        3: {
          rewardToken: { symbol: 'XT' },
          uniRewardTokenDollarPair: { token: 'XT' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00093),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(35_000_000)
        },
        31337: {
          rewardToken: { symbol: 'XT' },
          uniRewardTokenDollarPair: { token: 'XT' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.0003),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(30_000)
        },
        42: {
          rewardToken: { symbol: 'XT' },
          uniRewardTokenDollarPair: { token: 'XT' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.0034),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(35_000_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(20_000)
  },
  {
    key: '0x7375707261000000000000000000000000000000000000000000000000000000', // toBytes32('supra')
    coverName: 'Supra Oracles Cover',
    projectName: 'Supra Oracles',
    tags: ['Smart Contract', 'DeFi', 'Oracle'],
    about:
      'SupraOracles is the flagship project by the Entropy Foundation. This Swiss-based (CHE.383.364.961) entity is bringing SupraOracles’ multi-helix ledger and DeFi applications to developers globally. This unit is uniquely positioned with PhDs and professionals with extensive experience in cryptography, enterprise integrations, IoT solutions, DeFi primitives, innovative consensus modeling, randomness research, and oracle research culminating in decades of product development and coding experience. The intersection of the different academic fields has been key to our technical breakthroughs to solve the oracle dilemma.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the oracle network was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://supraoracles.com',
      twitter: 'https://twitter.com/SupraOracles',
      blog: 'https://medium.com/@SupraOracles',
      linkedin: 'https://www.linkedin.com/company/supraoracles'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(7500),
    resolutionSources: [
      'https://twitter.com/SupraOracles',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn SUPRA',
      settings: {
        3: {
          rewardToken: { symbol: 'SUPRA' },
          uniRewardTokenDollarPair: { token: 'SUPRA' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00093),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(35_000_000)
        },
        31337: {
          rewardToken: { symbol: 'SUPRA' },
          uniRewardTokenDollarPair: { token: 'SUPRA' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.0003),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(30_000)
        },
        42: {
          rewardToken: { symbol: 'XT' },
          uniRewardTokenDollarPair: { token: 'XT' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.0034),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(35_000_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(150_000)
  },
  {
    key: '0x6f6b000000000000000000000000000000000000000000000000000000000000', // toBytes32('ok')
    coverName: 'OKEx Cover',
    projectName: 'OKEx',
    tags: ['Smart Contract', 'DeFi', 'Exchange'],
    about:
      'OKEx is a Seychelles-based cryptocurrency exchange that provides a platform for trading various cryptocurrencies.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.okex.com',
      documentation: 'https://www.okex.com/docs-v5/en',
      telegram: 'https://t.me/OKExOfficial_English',
      twitter: 'https://twitter.com/OKEx',
      github: 'https://github.com/okex',
      facebook: 'https://www.facebook.com/okexofficial',
      blog: 'https://medium.com/okex-blog',
      discord: 'https://discord.com/invite/sanS9FuGV4',
      linkedin: 'https://www.linkedin.com/company/okex',
      slack: null
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(10_000),
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
          rewardToken: { symbol: 'OKB' },
          uniRewardTokenDollarPair: { token: 'OKB' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00093),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(35_000_000)
        },
        31337: {
          rewardToken: { symbol: 'OKB' },
          uniRewardTokenDollarPair: { token: 'OKB' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.0003),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(30_000)
        },
        42: {
          rewardToken: { symbol: 'OKB' },
          uniRewardTokenDollarPair: { token: 'OKB' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.0034),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(35_000_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(30_000)
  },
  {
    key: '0x68756f6269000000000000000000000000000000000000000000000000000000', // toBytes32('huobi')
    coverName: 'Huobi Cover',
    projectName: 'Huobi',
    tags: ['Exchange', 'DeFi', 'Exchange'],
    about: 'Huobi is a Seychelles-based cryptocurrency exchange.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.huobi.com/en-us',
      documentation:
        'https://docs.huobigroup.com/docs/option/v1/en/#introduction',
      telegram: 'https://t.me/huobiglobalofficial',
      twitter: 'https://twitter.com/HuobiGlobal',
      github: 'https://github.com/huobiapi',
      facebook: 'https://www.facebook.com/huobiglobalofficial',
      blog: 'https://huobiglobal.medium.com',
      discord: 'https://discord.com/invite/xrAq7Fv7Xx',
      linkedin: 'https://www.linkedin.com/company/huobi',
      slack: null
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 10 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 10 * MINUTES,
    minReportingStake: ether(35_000),
    resolutionSources: [
      'https://twitter.com/HuobiGlobal',
      'https://huobiglobal.medium.com',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn HT',
      settings: {
        3: {
          rewardToken: { symbol: 'HT' },
          uniRewardTokenDollarPair: { token: 'HT' },
          stakingTarget: ether(1_000_000),
          maxStake: ether(25_000),
          rewardPerBlock: ether(0.025),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(15_000_000)
        },
        31337: {
          rewardToken: { symbol: 'HT' },
          uniRewardTokenDollarPair: { token: 'HT' },
          stakingTarget: ether(1_000_000),
          maxStake: ether(25_000),
          rewardPerBlock: ether(0.025),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(25_000)
        },
        42: {
          rewardToken: { symbol: 'HT' },
          uniRewardTokenDollarPair: { token: 'HT' },
          stakingTarget: ether(1_000_000),
          maxStake: ether(25_000),
          rewardPerBlock: ether(0.025),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(15_000_000)
        }
      }
    },
    stakeWithFees: ether(20_000),
    reassurance: ether(10_000)
  },
  {
    key: '0x616e696d6f63612d6272616e6473000000000000000000000000000000000000', // toBytes32('animoca-brands')
    coverName: 'Animoca Brands',
    projectName: 'Animoca Brands',
    tags: ['Smart Contract', 'NFT', 'Gaming'],
    about:
      'Animoca Brands, a Deloitte Tech Fast winner that is ranked in the Financial Times list of High Growth Companies Asia-Pacific 2021, is a leader in digital entertainment, blockchain, and gamification. It develops and publishes a broad portfolio of products including the REVV token and SAND token; original games including The Sandbox, Crazy Kings, and Crazy Defense Heroes; and products utilizing popular intellectual properties including Formula 1®, Disney, WWE, Power Rangers, MotoGP™, and Doraemon. The company has multiple subsidiaries, including The Sandbox, Blowfish Studios, Quidd, GAMEE, nWay, Pixowl, Bondly, and Lympo. Animoca Brands has a growing portfolio of more than 150 investments in NFT-related companies and decentralized projects that are contributing to building the open metaverse, including Axie Infinity, OpenSea, Dapper Labs (NBA Top Shot), Bitski, Harmony, Alien Worlds, Star Atlas, and others.',
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.animocabrands.com',
      twitter: 'https://twitter.com/animocabrands',
      blog: 'https://animocabrands.medium.com',
      linkedin: 'https://www.linkedin.com/company/animoca-brands'
    },
    pricingFloor: percentage(7),
    pricingCeiling: percentage(24),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(3400),
    resolutionSources: [
      'https://twitter.com/animocabrands',
      'https://twitter.com/neptunemutual'
    ],
    stakeWithFees: ether(50_000),
    reassurance: ether(10_000)
  },
  {
    key: '0x63706f6f6c000000000000000000000000000000000000000000000000000000', // toBytes32('cpool')
    coverName: 'Clearpool Cover',
    projectName: 'Clearpool',
    tags: ['Smart Contract', 'Borrowing', 'Lending'],
    about:
      'Clearpool takes core concepts from traditional credit markets, and applies the principles of decentralization to create a decentralized capital markets ecosystem.',
    blockchains: [{
      chainId: 1,
      name: 'Main Ethereum Network'
    }],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the lending platform faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://clearpool.finance',
      documentation: 'https://docs.clearpool.finance/resources/documents',
      telegram: 'https://t.me/clearpoolofficial',
      twitter: 'https://twitter.com/ClearpoolFin',
      github: null,
      facebook: null,
      blog: 'https://clearpool.medium.com',
      discord: null,
      linkedin: null,
      slack: null
    },
    pricingFloor: percentage(9),
    pricingCeiling: percentage(32),
    reportingPeriod: 5 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 5 * MINUTES,
    minReportingStake: ether(2000),
    resolutionSources: [
      'https://twitter.com/ClearpoolFin',
      'https://clearpool.medium.com',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn CPOOL',
      settings: {
        3: {
          rewardToken: { symbol: 'CPOOL' },
          uniRewardTokenDollarPair: { token: 'CPOOL' },
          stakingTarget: ether(10_000_000),
          maxStake: ether(90_000),
          rewardPerBlock: ether(0.080),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(27_500_000)
        },
        31337: {
          rewardToken: { symbol: 'CPOOL' },
          uniRewardTokenDollarPair: { token: 'CPOOL' },
          stakingTarget: ether(10_000_000),
          maxStake: ether(90_000),
          rewardPerBlock: ether(0.080),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(200_000)
        },
        42: {
          rewardToken: { symbol: 'CPOOL' },
          uniRewardTokenDollarPair: { token: 'CPOOL' },
          stakingTarget: ether(10_000_000),
          maxStake: ether(90_000),
          rewardPerBlock: ether(0.080),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(27_500_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(50_000)
  },
  {
    key: '0x6269746d61727400000000000000000000000000000000000000000000000000', // toBytes32('xt')
    coverName: 'Bitmart Exchange Cover',
    projectName: 'Bitmart Exchange',
    tags: ['Smart Contract', 'DeFi', 'Exchange'],
    about:
      'Whether you are an individual or an institution, we want to help you buy, sell, and store your cryptocurrency. Our vision is to bring cryptocurrency available to everyone everywhere, we believe, the decentralized digital currency will reshape the global economic fundamentally, such financial freedom would bring further economic innovation, efficiency, and equality to the world. But it won’t happen unless we build simple, and secure products for individuals and institutions around the world to discover and interact with this new frontier.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.bitmart.com',
      documentation: 'https://support.bmx.fund/hc',
      twitter: 'https://twitter.com/BitMartExchange',
      blog: 'https://bitmart-exchange.medium.com',
      telegram: 'https://t.me/BitmartExchange'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(5000),
    resolutionSources: [
      'https://twitter.com/BitMartExchange',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn BMC',
      settings: {
        3: {
          rewardToken: { symbol: 'BMC' },
          uniRewardTokenDollarPair: { token: 'BMC' },
          stakingTarget: ether(400_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00093),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(15_000_000)
        },
        31337: {
          rewardToken: { symbol: 'BMC' },
          uniRewardTokenDollarPair: { token: 'BMC' },
          stakingTarget: ether(400_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.0003),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(30_000)
        },
        42: {
          rewardToken: { symbol: 'BMC' },
          uniRewardTokenDollarPair: { token: 'BMC' },
          stakingTarget: ether(400_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.0034),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(18_000_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(20_000)
  },
  {
    key: '0x71392d6361706974616c00000000000000000000000000000000000000000000', // toBytes32('q9-capital')
    coverName: 'Q9 Capital Cover',
    projectName: 'Q9 Capital',
    tags: ['Wallet', 'Investing', 'Trading'],
    about:
      'Q9 Capital is a full-service crypto platform built for individual and institutional investors. We deliver a simple and safe solution for crypto investing, providing investors with the platform and tools they need to maximize returns and generate income.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the investment platform was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.q9capital.com',
      documentation: 'https://q9capital.zendesk.com/hc/en-us/sections/360005345933-Legal-Documents'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(5000),
    resolutionSources: [
      'https://www.q9capital.com',
      'https://twitter.com/neptunemutual'
    ],
    stakeWithFees: ether(50_000),
    reassurance: ether(20_000)
  },
  {
    key: '0x65716962616e6b00000000000000000000000000000000000000000000000000', // toBytes32('eqibank')
    coverName: 'Eqibank OTC Cover',
    projectName: 'Eqibank',
    tags: ['Wallet', 'Investing', 'Trading'],
    about:
      'EQIBank is the easiest place to buy and sell cryptocurrency. Create your cryptocurrency portfolio today with Licensed and Regulated Bank. We offer Trading, Custody, Loans, and Investments. In addition, EQIBank’s OTC team provides insights and expert assistance to help you navigate the complicated world of crypto while ensuring your assets are always safe and secure.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the OTC platform was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://otc.eqibank.com',
      linkedin: 'https://www.linkedin.com/company/eqibank',
      twitter: 'https://twitter.com/eqibank'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(5000),
    resolutionSources: [
      'https://otc.eqibank.com',
      'https://twitter.com/neptunemutual'
    ],
    stakeWithFees: ether(50_000),
    reassurance: ether(20_000)
  }
]

module.exports = { covers }
