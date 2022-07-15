const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x676e6f7369732d73616665000000000000000000000000000000000000000000',
  productName: 'Gnosis Safe',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(70),
  tags: ['Ehereum', 'DApp', 'Prime', 'Smart Contract', 'Multisig'],
  about: 'Gnosis Safe is the successor to the Gnosis Multisig. Multi-signature. Multi-signature allows you define an access/control-scheme through multiple signers that need to confirm transactions. DeFi integrations. Easily interact with popular decentralized finance protocols to invest, trade and manage digital assets.',
  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: 'https://gnosis-safe.io/',
    twitter: 'https://twitter.com/gnosisSafe',
    discord: 'https://discord.com/invite/AjG7AQD9Qn',
    github: 'https://github.com/safe-global',
    documentation: 'https://docs.gnosis-safe.io/'
  },
  resolutionSources: [
    'https://twitter.com/gnosisSafe',
    'https://twitter.com/neptunemutual'
  ]
}
