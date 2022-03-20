const { ether, percentage } = require('../util/helper')
const { minutesToBlocks } = require('../util/block-time')

const MINUTES = 60

const covers = [
  {
    key: '0x616e696d617465642d6272616e64730000000000000000000000000000000000', // toBytes32('animated-brands')
    coverName: 'Animated Brands',
    projectName: 'Animated Brands',
    requiresWhitelist: false,
    tags: ['Smart Contract', 'NFT', 'Gaming'],
    about:
      'Animated Brands is a Thailand based gaming company, and a venture capitalist firm founded in 2017 by Jack D\'Souza. It was listed on Singapore Exchange (SGX) from 23rd May, 2019.',
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.animatedbrands.com',
      twitter: 'https://twitter.com/animatedbrands',
      blog: 'https://animatedbrands.medium.com',
      linkedin: 'https://www.linkedin.com/company/animated-brands'
    },
    pricingFloor: percentage(7),
    pricingCeiling: percentage(24),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(3400),
    resolutionSources: [
      'https://twitter.com/animatedbrands',
      'https://twitter.com/neptunemutual'
    ],
    stakeWithFees: ether(50_000),
    reassurance: ether(10_000)
  },
  {
    key: '0x6262382d65786368616e67650000000000000000000000000000000000000000', // toBytes32('bb8-exchange')
    coverName: 'Bb8 Exchange Cover',
    projectName: 'Bb8 Exchange',
    requiresWhitelist: false,
    tags: ['Smart Contract', 'DeFi', 'Exchange'],
    about: 'BB8 Exchange is a global cryptocurrency exchange that lets users from over 140 countries buy and sell over 1200 different digital currencies and tokens. BB8 Exchange offers a simple buy/sell crypto function for beginners as well as a variety of crypto-earning options, in addition to expert cryptocurrency spot and futures trading platforms. On this platform, both novice and expert traders may find what they\'re looking for.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.bb8exchange.com',
      documentation: 'https://support.bmx.fund/hc',
      twitter: 'https://twitter.com/BB8Exchange',
      blog: 'https://bb8-exchange.medium.com',
      telegram: 'https://t.me/BB8Exchange'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(5000),
    resolutionSources: [
      'https://twitter.com/BB8Exchange',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn BEC',
      settings: {
        3: {
          rewardToken: { symbol: 'BEC' },
          uniRewardTokenDollarPair: { token: 'BEC' },
          stakingTarget: ether(400_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.000000093),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(15_000_000)
        },
        31337: {
          rewardToken: { symbol: 'BEC' },
          uniRewardTokenDollarPair: { token: 'BEC' },
          stakingTarget: ether(400_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00000003),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(30_000)
        },
        80001: {
          rewardToken: { symbol: 'BEC' },
          uniRewardTokenDollarPair: { token: 'BEC' },
          stakingTarget: ether(400_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00000034),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(18_000_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(20_000)
  },
  {
    key: '0x6372706f6f6c0000000000000000000000000000000000000000000000000000', // toBytes32('crpool')
    coverName: 'Crystalpool Cover',
    projectName: 'Crystalpool',
    requiresWhitelist: false,
    tags: ['Smart Contract', 'Borrowing', 'Lending'],
    about: 'The BSC ecosystem will be home to Crystalpool, the first decentralized marketplace for unsecured liquidity on the blockchain. Crystalpool Finance will integrate the full-stack scaling solution to give its customers more access and functionality, as well as its single-borrower liquidity pools, thematic pools, and tokenized credit solution, offering retail lenders more access to high-yielding loan options.',
    blockchains: [{
      chainId: 1,
      name: 'Main Ethereum Network'
    }],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the lending platform faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://crstalpool.finance',
      documentation: 'https://docs.crstalpool.finance/resources/documents',
      telegram: 'https://t.me/crstalpoolofficial',
      twitter: 'https://twitter.com/CrstalpoolFin',
      blog: 'https://crstalpool.medium.com'
    },
    pricingFloor: percentage(9),
    pricingCeiling: percentage(32),
    reportingPeriod: 5 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 5 * MINUTES,
    minReportingStake: ether(2000),
    resolutionSources: [
      'https://twitter.com/CrstalpoolFin',
      'https://crstalpool.medium.com',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn CRPOOL',
      settings: {
        3: {
          rewardToken: { symbol: 'CRPOOL' },
          uniRewardTokenDollarPair: { token: 'CRPOOL' },
          stakingTarget: ether(10_000_000),
          maxStake: ether(90_000),
          rewardPerBlock: ether(0.0000080),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(27_500_000)
        },
        31337: {
          rewardToken: { symbol: 'CRPOOL' },
          uniRewardTokenDollarPair: { token: 'CRPOOL' },
          stakingTarget: ether(10_000_000),
          maxStake: ether(90_000),
          rewardPerBlock: ether(0.0000080),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(200_000)
        },
        80001: {
          rewardToken: { symbol: 'CRPOOL' },
          uniRewardTokenDollarPair: { token: 'CRPOOL' },
          stakingTarget: ether(10_000_000),
          maxStake: ether(90_000),
          rewardPerBlock: ether(0.0000080),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(27_500_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(50_000)
  },
  {
    key: '0x68696369662d62616e6b00000000000000000000000000000000000000000000', // toBytes32('hicif-bank')
    coverName: 'Hicif Bank OTC Cover',
    projectName: 'Hicif Bank',
    requiresWhitelist: false,
    tags: ['Wallet', 'Investing', 'Trading'],
    about: 'Hicif Bank, which was founded in 2017 and is based on the beautiful Portuguese island of Madeira, is one of the world\'s leading digital banks, aiming to deliver financial solutions to more countries than any other digital bank.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the OTC platform was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://otc.hicifbank.com',
      linkedin: 'https://www.linkedin.com/company/hicifbank',
      twitter: 'https://twitter.com/hicifbank'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(5000),
    resolutionSources: [
      'https://otc.hicifbank.com',
      'https://twitter.com/neptunemutual'
    ],
    stakeWithFees: ether(50_000),
    reassurance: ether(20_000)
  },
  {
    key: '0x68756f62692d77616e0000000000000000000000000000000000000000000000', // toBytes32('huobi-wan')
    coverName: 'Huobi-Wan Cover',
    projectName: 'Huobi-Wan',
    requiresWhitelist: false,
    tags: ['Exchange', 'DeFi', 'Exchange'],
    about: 'HUOBI-WAN is a cryptocurrency exchange situated in the Canary Islands that offers secure, dependable, and convenient trading services for thousands of digital assets. Since its inception in 2019, HUOBI-WAN has enabled users to buy, sell, stake, and borrow a wide range of cryptocurrencies, providing an all-encompassing ecosystem for experienced crypto traders and investors. It distinguishes itself through cutting-edge technology, a diverse product offering, and a truly global presence that spans more than 80 countries.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.huobiwan.com/en-us',
      documentation:
        'https://docs.huobiwangroup.com/docs/option/v1/en/#introduction',
      telegram: 'https://t.me/huobiwanglobalofficial',
      twitter: 'https://twitter.com/HuobiWanGlobal',
      github: 'https://github.com/huobiwanapi',
      facebook: 'https://www.facebook.com/huobiwanglobalofficial',
      blog: 'https://huobiwanglobal.medium.com',
      linkedin: 'https://www.linkedin.com/company/huobiwan',
      slack: null
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 10 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 10 * MINUTES,
    minReportingStake: ether(35_000),
    resolutionSources: [
      'https://twitter.com/HuobiWanGlobal',
      'https://huobiwanglobal.medium.com',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn HWT',
      settings: {
        3: {
          rewardToken: { symbol: 'HWT' },
          uniRewardTokenDollarPair: { token: 'HWT' },
          stakingTarget: ether(1_000_000),
          maxStake: ether(25_000),
          rewardPerBlock: ether(0.0000025),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(15_000_000)
        },
        31337: {
          rewardToken: { symbol: 'HWT' },
          uniRewardTokenDollarPair: { token: 'HWT' },
          stakingTarget: ether(1_000_000),
          maxStake: ether(25_000),
          rewardPerBlock: ether(0.0000025),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(25_000)
        },
        80001: {
          rewardToken: { symbol: 'HWT' },
          uniRewardTokenDollarPair: { token: 'HWT' },
          stakingTarget: ether(1_000_000),
          maxStake: ether(25_000),
          rewardPerBlock: ether(0.0000025),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(15_000_000)
        }
      }
    },
    stakeWithFees: ether(20_000),
    reassurance: ether(10_000)
  },
  {
    key: '0x6f626b0000000000000000000000000000000000000000000000000000000000', // toBytes32('obk')
    coverName: 'Ob1-Ex Cover',
    projectName: 'Ob1-Ex',
    requiresWhitelist: false,
    tags: ['Smart Contract', 'DeFi', 'Exchange'],
    about: 'OB1-EX is a cutting-edge cryptocurrency exchange with advanced financial services that strives to provide you everything you need to make informed trading and investing decisions. OB1-EX is dedicated to serving hundred and thousands of users in over 30 countries with a diverse collection of opportunities connected to spot, margin, futures, options, DeFi, lending, and mining services, with over 500 digital assets and trading pairs.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.ob1ex.com',
      documentation: 'https://www.ob1ex.com/docs-v5/en',
      telegram: 'https://t.me/Ob1ExOfficial_English',
      twitter: 'https://twitter.com/Ob1Ex',
      github: 'https://github.com/ob1ex',
      facebook: 'https://www.facebook.com/ob1exofficial',
      blog: 'https://medium.com/ob1ex-blog',
      linkedin: 'https://www.linkedin.com/company/ob1ex',
      slack: null
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(10_000),
    resolutionSources: [
      'https://twitter.com/ob1ex',
      'https://medium.com/ob1ex-blog',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn OBK',
      settings: {
        3: {
          rewardToken: { symbol: 'OBK' },
          uniRewardTokenDollarPair: { token: 'OBK' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.000000093),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(35_000_000)
        },
        31337: {
          rewardToken: { symbol: 'OBK' },
          uniRewardTokenDollarPair: { token: 'OBK' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00000003),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(30_000)
        },
        80001: {
          rewardToken: { symbol: 'OBK' },
          uniRewardTokenDollarPair: { token: 'OBK' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00000034),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(35_000_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(30_000)
  },
  {
    key: '0x71616e696c69612d6361706974616c0000000000000000000000000000000000', // toBytes32('qanilia-capital')
    coverName: 'Qanilia Capital Cover',
    projectName: 'Qanilia Capital',
    requiresWhitelist: false,
    tags: ['Wallet', 'Investing', 'Trading'],
    about: 'Qanilia Capital is a cryptocurrency and digital asset platform that offers personal and institutional clients investment alternatives. Qanilia Capital was founded in 2019 and is headquartered in China, and is on course to deliver cutting-edge trading capabilities, creative goods, and individualized service that is fast, simple, and secure access to the decentralised financial sector.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the investment platform was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.qanilia-capital.com',
      documentation: 'https://qanilia-capital.zendesk.com/hc/en-us/sections/360005345933-Legal-Documents'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(5000),
    resolutionSources: [
      'https://www.qanilia-capital.com',
      'https://twitter.com/neptunemutual'
    ],
    stakeWithFees: ether(50_000),
    reassurance: ether(20_000)
  },
  {
    key: '0x73616272652d6f7261636c657300000000000000000000000000000000000000', // toBytes32('sabre-oracles')
    coverName: 'Sabre Oracles Cover',
    projectName: 'Sabre Oracles',
    requiresWhitelist: false,
    tags: ['Smart Contract', 'DeFi', 'Oracle'],
    about: 'Sabre Oracles, founded in 2015, offers a non-exclusive, credibly neutral, and highly reliable oracle solution by bridging real-world data to automate, simplify, and secure smart contracts, with the goal of developing a blockchain network that uses real-time data from financial markets for a secure interface and DeFi platforms.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the oracle network was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://sabreoracles.com',
      twitter: 'https://twitter.com/SubreOracles',
      blog: 'https://medium.com/@SabreOracles',
      linkedin: 'https://www.linkedin.com/company/sabreaoracles'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(7500),
    resolutionSources: [
      'https://twitter.com/SabreOracles',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn SABRE',
      settings: {
        3: {
          rewardToken: { symbol: 'SABRE' },
          uniRewardTokenDollarPair: { token: 'SABRE' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.000000093),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(35_000_000)
        },
        31337: {
          rewardToken: { symbol: 'SABRE' },
          uniRewardTokenDollarPair: { token: 'SABRE' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00000003),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(30_000)
        },
        80001: {
          rewardToken: { symbol: 'SABRE' },
          uniRewardTokenDollarPair: { token: 'SABRE' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00000034),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(35_000_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(150_000)
  },
  {
    key: '0x7832643200000000000000000000000000000000000000000000000000000000', // toBytes32('x2d2')
    coverName: 'X2D2 Exchange Cover',
    projectName: 'X2D2 Exchange',
    requiresWhitelist: true,
    tags: ['Smart Contract', 'DeFi', 'Exchange'],
    about: 'X2D2-Exchange was established in 2020 and is based in Seychelles. X2D2-Exchange has active operation centers in Bangalore, Hong Kong, Japan, and other countries, and offers a comprehensive trading platform that supports 50+ high-quality currencies and 100 trading pairs, allowing users to access the safest, most efficient, and professional digital asset investment services.',
    blockchains: [],
    rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the exchange was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
    links: {
      website: 'https://www.x2d2.com',
      documentation: 'https://doc.x2d2.com',
      twitter: 'https://twitter.com/x2d2exchange',
      blog: 'https://medium.com/@x2d2_com',
      linkedin: 'https://www.linkedin.com/company/x2d2-com-exchange'
    },
    pricingFloor: percentage(2),
    pricingCeiling: percentage(14),
    reportingPeriod: 30 * MINUTES,
    cooldownPeriod: 5 * MINUTES,
    claimPeriod: 30 * MINUTES,
    minReportingStake: ether(5000),
    resolutionSources: [
      'https://twitter.com/x2d2exchange',
      'https://twitter.com/neptunemutual'
    ],
    // This property is optional
    stakingPool: {
      name: 'Earn XD',
      settings: {
        3: {
          rewardToken: { symbol: 'XD' },
          uniRewardTokenDollarPair: { token: 'XD' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.000000093),
          lockupPeriodInBlocks: minutesToBlocks(3, 5),
          rewardTokenDeposit: ether(35_000_000)
        },
        31337: {
          rewardToken: { symbol: 'XD' },
          uniRewardTokenDollarPair: { token: 'XD' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00000003),
          lockupPeriodInBlocks: minutesToBlocks(31337, 5),
          rewardTokenDeposit: ether(30_000)
        },
        80001: {
          rewardToken: { symbol: 'XD' },
          uniRewardTokenDollarPair: { token: 'XD' },
          stakingTarget: ether(800_000),
          maxStake: ether(20_000),
          rewardPerBlock: ether(0.00000034),
          lockupPeriodInBlocks: minutesToBlocks(42, 5),
          rewardTokenDeposit: ether(35_000_000)
        }
      }
    },
    stakeWithFees: ether(50_000),
    reassurance: ether(20_000)
  }
]

module.exports = { covers }
