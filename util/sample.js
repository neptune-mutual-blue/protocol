const info = {
  key: '0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000000',
  name: 'Compound Finance Cover',
  tags: ['Smart Contract', 'DeFi', 'Lending'],
  rules: `1. You must have maintained at least 1 NEP tokens in your wallet during your coverage period.
        2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
        3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
        4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
  createdBy: '0x0702e0d43e2b73f2c9425d8424077e4da55f0110',
  resolutionSources: ['https://twitter.com/compoundfinance', 'https://medium.com/compound-finance', 'https://twitter.com/neptunemutual'],
  assuranceToken: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  permalink: 'https://app.neptunemutual.com/covers/0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000000'
}

const fake = {
  TREASURY: '0xECd0023B976c4008ef3D3FBD58c84C6d1A59c59e',
  ASSURANCE_VAULT: '0x34f12E31DC5EBC3c2cDBdeEBf6a74005B3301902'
}

module.exports = { info, fake }
