const info = {
  key: '0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000010',
  coverName: 'Compound Finance Cover',
  projectName: 'Compound Finance',
  about: 'Compound is an algorithmic, autonomous interest rate protocol built for developers, to unlock a universe of open financial applications.',
  tags: ['Smart Contract', 'DeFi', 'Lending'],
  blockchain: {
    chainId: 1,
    name: 'Main Ethereum Network'
  },
  smartContracts: ['0xc00e94cb662c3520282e6f5717214004a7f26888'],
  parameters: [
    {
      parameter: 'Cover Policy Conditions',
      type: 'condition',
      text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
      list: {
        type: 'unordered',
        items: [
          '',
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
    website: 'https://compound.finance/',
    documentation: 'https://docs.compound.finance/',
    telegram: null,
    twitter: 'https://twitter.com/compoundfinance',
    github: 'https://github.com/compound',
    facebook: 'https://facebook.com/compoundfinance',
    blog: 'https://blog.medium.com/compoundfinance',
    discord: 'https://discord.com/invite/cU7vmVW',
    linkedin: 'https://linkedin.com/in/compoundfinance',
    slack: null
  },
  reportingPeriod: 7,
  selfCoveragePeriod: 30,
  resolutionSources: ['https://twitter.com/compoundfinance', 'https://medium.com/compound-finance', 'https://twitter.com/neptunemutual'],
  reassuranceToken: {
    at: '0x0e7c8a8545352663ee070f1c9a0174f4a50532dc',
    name: 'Compound',
    symbol: 'COMP',
    initialAmount: '5000000000000000000000'
  },
  stakeWithFee: '5000000000000000000000',
  initialLiquidity: '5000000000000000000000'
}

const fake = {
  TREASURY: '0xECd0023B976c4008ef3D3FBD58c84C6d1A59c59e',
  REASSURANCE_VAULT: '0x34f12E31DC5EBC3c2cDBdeEBf6a74005B3301902'
}

module.exports = { info, fake }
