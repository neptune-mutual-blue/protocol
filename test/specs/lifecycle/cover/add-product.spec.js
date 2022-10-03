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
  const stakeWithFee = helper.ether(10000)
  const minStakeToReport = helper.ether(250)
  const reportingPeriod = 7 * DAYS
  const cooldownPeriod = 1 * DAYS
  const claimPeriod = 7 * DAYS
  const floor = helper.percentage(7)
  const ceiling = helper.percentage(45)
  const reassuranceRate = helper.percentage(50)
  const leverageFactor = '1'

  const requiresWhitelist = false
  const info = key.toBytes32('info')

  before(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
      coverKey,
      info,
      tokenName: 'POD',
      tokenSymbol: 'POD',
      supportsProducts: true,
      requiresWhitelist: false,
      stakeWithFee,
      initialReassuranceAmount,
      minStakeToReport,
      reportingPeriod,
      cooldownPeriod,
      claimPeriod,
      floor,
      ceiling,
      reassuranceRate,
      leverageFactor
    })
  })

  it('correctly adds product when accessed by cover creator', async () => {
    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    }).should.not.be.rejected
  })

  it('reverts when tried to added the same product key twice', async () => {
    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    }).should.be.rejectedWith('Already exists')
  })

  it('reverts when the accessed by non-whitelisted cover creator', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [false])

    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    }).should.be.rejectedWith('Not whitelisted')

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])
  })

  it('reverts when status is invalid', async () => {
    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '0',
      efficiency: '10000'
    }).should.be.rejectedWith('Status must be active')

    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '2',
      efficiency: '10000'
    }).should.be.rejectedWith('Status must be active')
  })

  it('reverts when efficiency is invalid', async () => {
    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '0'
    }).should.be.rejectedWith('Invalid efficiency')

    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10001'
    }).should.be.rejectedWith('Invalid efficiency')
  })

  it('reverts when product key is invalid', async () => {
    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32(''),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    }).should.be.rejectedWith('Invalid product key')
  })

  it('reverts when cover does not support products', async () => {
    const [owner] = await ethers.getSigners()

    const coverKey = key.toBytes32('foo-bar-without-products')

    deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
      coverKey,
      info,
      tokenName: 'POD',
      tokenSymbol: 'POD',
      supportsProducts: false,
      requiresWhitelist: false,
      stakeWithFee,
      initialReassuranceAmount,
      minStakeToReport,
      reportingPeriod,
      cooldownPeriod,
      claimPeriod,
      floor,
      ceiling,
      reassuranceRate,
      leverageFactor
    })

    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    }).should.be.rejectedWith('Does not have products')
  })

  it('reverts when not accessed by cover creator', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist([bob.address], [true])

    await deployed.cover.connect(bob).addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    }).should.be.rejectedWith('Forbidden')

    await deployed.cover.updateCoverCreatorWhitelist([bob.address], [false])
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()

    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    }).should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })
})
