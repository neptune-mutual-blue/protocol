/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, helper, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Distributor: `getPremium` function', () => {
  let deployed, treasury, feePercentage, distributor

  before(async () => {
    deployed = await deployDependencies()

    treasury = helper.randomAddress()
    feePercentage = helper.percentage(20)

    distributor = await deployer.deploy(cache, 'NPMDistributor', deployed.store.address, treasury, feePercentage)
  })

  it('must correctly get premium', async () => {
    const coverKey = deployed.coverKey
    const duration = '2'
    const protection = helper.ether(10_000)

    const [premium, fee] = await distributor.getPremium(coverKey, duration, protection)

    premium.should.be.gt('0')
    fee.should.be.gt('0')
  })

  it('must reject if DAI address is not registered on the protocol', async () => {
    const coverKey = deployed.coverKey
    const duration = '2'
    const protection = helper.ether(10_000)

    const storeKey = key.qualifyBytes32(key.toBytes32('cns:cover:policy'))
    await deployed.store.deleteAddress(storeKey)

    await distributor.getPremium(coverKey, duration, protection)
      .should.be.rejectedWith('Fatal: Policy missing')

    await deployed.store.setAddress(storeKey, deployed.policy.address)
  })
})
