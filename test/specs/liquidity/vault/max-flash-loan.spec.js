/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper } = require('../../../../util')
const { deployDependencies } = require('./deps')
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Flashloan: max flash loan', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('must get max flashloan amount', async () => {
    const result = await deployed.vault.maxFlashLoan(deployed.stablecoin.address)

    result.should.equal(helper.ether(4_000_000, PRECISION))
  })
})
