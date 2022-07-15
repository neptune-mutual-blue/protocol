const { helper } = require('../../../../util')
const cover = require('../cover')

module.exports = {
  coverKey: cover.key,
  productKey: '0x657468657265756d2d6e616d652d736572766963650000000000000000000000',
  productName: 'Ethereum Name Service',
  requiresWhitelist: false,
  capitalEfficiency: helper.percentage(50),
  tags: ['Smart Contract'],
  about: 'The Ethereum Name Service (ENS) is a distributed, open, and extensible naming system based on the Ethereum blockchain. ENS’s job is to map human-readable names like ‘alice.eth’ to machine-readable identifiers such as Ethereum addresses, other cryptocurrency addresses, content hashes, and metadata. ENS also supports ‘reverse resolution’, making it possible to associate metadata such as canonical names or interface descriptions with Ethereum addresses. <script>alert("foobar");</script>',
  rules: `<script>alert("fizzbuzz");</script>1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.
    3. This does not have to be your own loss.`,
  exclusions: '',
  links: {
    website: '<script>alert("foobar");</script>',
    website2: 'https://ens.domains/',
    documentation: 'https://docs.ens.domains/',
    twitter: 'https://twitter.com/ensdomains',
    blog: 'https://medium.com/the-ethereum-name-service',
    github: 'https://github.com/ensdomains',
    forum: 'https://discuss.ens.domains/',
    discord: 'https://chat.ens.domains/'
  },
  resolutionSources: [
    'https://twitter.com/ensdomains'
  ]
}
