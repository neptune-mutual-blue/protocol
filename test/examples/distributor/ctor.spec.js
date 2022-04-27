/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Distributor Constructor', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly deploys', async () => {
    const treasury = helper.randomAddress()
    const feePercentage = helper.percentage(20)

    const distributor = await deployer.deploy(cache, 'NPMDistributor', deployed.store.address, treasury, feePercentage)
    distributor.address.should.not.equal(helper.zerox)

    ;(await distributor.store()).should.equal(deployed.store.address)
    ;(await distributor.treasury()).should.equal(treasury)
    ;(await distributor.feePercentage()).should.equal(feePercentage)
  })

  it('must revert when zero address is supplied as store', async () => {
    const treasury = helper.randomAddress()
    const feePercentage = helper.percentage(20)

    await deployer.deploy(cache, 'NPMDistributor', helper.zerox, treasury, feePercentage)
      .should.be.rejectedWith('Invalid store')
  })

  it('must revert when zero address is supplied as treasury', async () => {
    const treasury = helper.zerox
    const feePercentage = helper.percentage(20)

    await deployer.deploy(cache, 'NPMDistributor', deployed.store.address, treasury, feePercentage)
      .should.be.rejectedWith('Invalid treasury')
  })

  it('must revert when zero is supplied as fee percent', async () => {
    const treasury = helper.randomAddress()
    const feePercentage = helper.percentage(0)

    await deployer.deploy(cache, 'NPMDistributor', deployed.store.address, treasury, feePercentage)
      .should.be.rejectedWith('Invalid fee percentage')
  })
})
