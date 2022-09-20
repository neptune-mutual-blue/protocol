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

describe('Cover: addCover', () => {
  let deployed

  const coverKey = key.toBytes32('foo-bar')
  const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
  const stakeWithFee = helper.ether(10_000)
  const minStakeToReport = helper.ether(250)
  const reportingPeriod = 7 * DAYS
  const cooldownPeriod = 1 * DAYS
  const claimPeriod = 7 * DAYS
  const floor = helper.percentage(7)
  const ceiling = helper.percentage(45)
  const reassuranceRate = helper.percentage(50)
  const leverageFactor = '1'

  const info = key.toBytes32('info')

  const args = {
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
  }

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly adds cover when accessed by whitelisted cover creator', async () => {
    const [owner] = await ethers.getSigners()

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover(args)
  })

  it('reverts when not accessed by whitelisted cover creator', async () => {
    const [owner, bob] = await ethers.getSigners()

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.connect(bob).addCover(args)
      .should.be.rejectedWith('Not whitelisted')
  })

  it('reverts when stake amount is less than NS_COVER_CREATION_MIN_STAKE', async () => {
    const [owner] = await ethers.getSigners()

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
      ...args,
      stakeWithFee: helper.ether(1)
    }).should.be.rejectedWith('Your stake is too low')
  })
})
