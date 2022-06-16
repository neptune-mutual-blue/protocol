/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault: transferGovernance', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('reverts when coverkey is invalid', async () => {
    const coverKey = key.toBytes32('foo-bar2')
    const amount = helper.ether(1_000, PRECISION)
    const address = helper.zero1

    await deployed.vault.transferGovernance(coverKey, address, amount)
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when invalid amount is supplied', async () => {
    const coverKey = key.toBytes32('foo-bar')
    const amount = helper.ether(0)
    const address = helper.zero1

    await deployed.vault.transferGovernance(coverKey, address, amount)
      .should.be.rejectedWith('Please specify amount')
  })
})
