/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper } = require('../../../../util')
const { deployDependencies } = require('./deps')
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault: getInfo', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly gets vault info', async () => {
    const [owner] = await ethers.getSigners()

    const result = await deployed.vault.getInfo(owner.address)
    result[0].should.equal(helper.ether(4_000_000))
    result[1].should.equal(helper.ether(4_000_000, PRECISION))
  })
})
