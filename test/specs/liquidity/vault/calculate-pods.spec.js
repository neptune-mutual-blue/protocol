/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper } = require('../../../../util')
const { deployDependencies } = require('./deps')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault: calculatePods', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly calculates amount of pods', async () => {
    const result = await deployed.vault.calculatePods(helper.ether(1_000))
    result.should.equal(helper.ether(1_000))
  })
})
