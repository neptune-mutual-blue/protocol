/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: addProduct', () => {
  let deployed

  const coverKey = key.toBytes32('foo-bar')
  const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
  const stakeWithFee = helper.ether(10_000)
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

  before(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]
    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', true, requiresWhitelist, values)
  })

  it('correctly adds product when accessed by cover creator', async () => {
    await deployed.cover.addProduct(coverKey, key.toBytes32('test'), info, requiresWhitelist, [1, 10_000])
  })

  it('reverts when tried to added the same product key twice', async () => {
    await deployed.cover.addProduct(coverKey, key.toBytes32('test'), info, requiresWhitelist, [1, 10_000])
      .should.be.rejectedWith('Already exists')
  })

  it('reverts when the accessed by non-whitelisted cover creator', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, false)
    await deployed.cover.addProduct(coverKey, key.toBytes32('test2'), info, requiresWhitelist, [1, 10_000])
      .should.be.rejectedWith('Not whitelisted')
    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)
  })

  it('reverts when status is invalid', async () => {
    await deployed.cover.addProduct(coverKey, key.toBytes32('test'), info, requiresWhitelist, [0, 100])
      .should.be.rejectedWith('Status must be active')

    await deployed.cover.addProduct(coverKey, key.toBytes32('test'), info, requiresWhitelist, [2, 100])
      .should.be.rejectedWith('Status must be active')
  })

  it('reverts when efficiency is invalid', async () => {
    await deployed.cover.addProduct(coverKey, key.toBytes32('test'), info, requiresWhitelist, [1, 0])
      .should.be.rejectedWith('Invalid efficiency')

    await deployed.cover.addProduct(coverKey, key.toBytes32('test'), info, requiresWhitelist, [1, 10_001])
      .should.be.rejectedWith('Invalid efficiency')
  })

  it('reverts when product key is invalid', async () => {
    await deployed.cover.addProduct(coverKey, key.toBytes32(''), info, requiresWhitelist, [1, 100]).should.be.rejectedWith('Invalid product key')
  })

  it('reverts when cover does not support products', async () => {
    const [owner] = await ethers.getSigners()

    const coverKey = key.toBytes32('foo-bar-without-products')

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]
    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)

    await deployed.cover.addProduct(coverKey, key.toBytes32(''), info, requiresWhitelist, [1, 100])
      .should.be.rejectedWith('Does not have products')
  })

  it('reverts when not accessed by cover creator', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist(bob.address, true)
    await deployed.cover.connect(bob).addProduct(coverKey, key.toBytes32(''), info, requiresWhitelist, [1, 100])
      .should.be.rejectedWith('Forbidden')
    await deployed.cover.updateCoverCreatorWhitelist(bob.address, false)
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()
    await deployed.cover.addProduct(coverKey, key.toBytes32(''), info, requiresWhitelist, [1, 100])
      .should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })
})
