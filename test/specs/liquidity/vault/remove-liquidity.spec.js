/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { network } = require('hardhat')
const { helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault: removeLiquidity', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('reverts when coverkey is invalid', async () => {
    const coverKey = key.toBytes32('foo-bar2')
    const amount = helper.ether(1_000)
    const npmStake = helper.ether(500)

    await deployed.vault.removeLiquidity(coverKey, amount, npmStake, false)
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when invalid amount is supplied', async () => {
    const coverKey = key.toBytes32('foo-bar')
    const amount = helper.ether(0)
    const npmStake = helper.ether(1)

    await deployed.vault.removeLiquidity(coverKey, amount, npmStake, false)
      .should.be.rejectedWith('Please specify amount')
  })
})
