/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: updateProduct', () => {
  let deployed

  const coverKey = key.toBytes32('foo-bar')
  const productKey = key.toBytes32('test-product-key')
  const stakeWithFee = helper.ether(10_000)
  const initialReassuranceAmount = helper.ether(1_000_000)
  const minReportingStake = helper.ether(250)
  const reportingPeriod = 7 * DAYS
  const cooldownPeriod = 1 * DAYS
  const claimPeriod = 7 * DAYS
  const floor = helper.percentage(7)
  const ceiling = helper.percentage(45)
  const reassuranceRate = helper.percentage(50)
  const leverage = '1'

  const requiresWhitelist = false
  const info = key.toBytes32('info')

  const coverValues = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]
  const productValues = [1, 10_000]

  before(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, coverValues)

    await deployed.cover.addProduct(coverKey, productKey, info, requiresWhitelist, productValues)
  })

  it('correctly update product when accessed by cover creator', async () => {
    await deployed.cover.updateProduct(coverKey, productKey, info, productValues)
  })

  it('reverts when tried to update a retired product', async () => {
    await deployed.cover.addProduct(coverKey, key.toBytes32('retired-product'), info, requiresWhitelist, productValues)
    await deployed.cover.updateProduct(coverKey, key.toBytes32('retired-product'), info, [2, 10_000])
    await deployed.cover.updateProduct(coverKey, key.toBytes32('retired-product'), info, [1, 10_000]).should.be.rejectedWith('Product retired or deleted')
  })

  it('reverts when tried to update a deleted product', async () => {
    await deployed.cover.addProduct(coverKey, key.toBytes32('deleted-product'), info, requiresWhitelist, productValues)
    await deployed.cover.updateProduct(coverKey, key.toBytes32('deleted-product'), info, [0, 10_000])
    await deployed.cover.updateProduct(coverKey, key.toBytes32('deleted-product'), info, [1, 10_000]).should.be.rejectedWith('Product retired or deleted')
  })

  it('reverts when efficiency is invalid', async () => {
    await deployed.cover.updateProduct(coverKey, productKey, info, [1, 0]).should.be.rejectedWith('Invalid efficiency')
    await deployed.cover.updateProduct(coverKey, productKey, info, [1, 10_001]).should.be.rejectedWith('Invalid efficiency')
  })

  it('reverts when status is invalid', async () => {
    await deployed.cover.updateProduct(coverKey, productKey, info, [3, 100]).should.be.rejectedWith('Invalid product status')
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()
    await deployed.cover.updateProduct(coverKey, key.toBytes32(''), info, productValues)
      .should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })
})
