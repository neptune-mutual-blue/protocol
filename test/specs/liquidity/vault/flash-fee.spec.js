/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployDependencies } = require('./deps')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Flashloan: flashFee', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('must get flashloan fee', async () => {
    const amount = 200
    const fee = 1 // Flash Loan Fee: 0.5%

    const result = await deployed.vault.flashFee(deployed.stablecoin.address, amount)
    result.should.equal(fee)
  })
})
