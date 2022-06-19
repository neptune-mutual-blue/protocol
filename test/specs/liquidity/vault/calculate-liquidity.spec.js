/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper } = require('../../../../util')
const { deployDependencies } = require('./deps')
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault: calculateLiquidity', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly calculates the liquidity', async () => {
    const result = await deployed.vault.calculateLiquidity(helper.ether(1_000))
    result.should.equal(helper.ether(1_000, PRECISION))
  })
})
