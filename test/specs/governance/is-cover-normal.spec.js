/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const composer = require('../../../util/composer')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS



require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe("Get all products in a cover is normal", ()=>{

  let deployed, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()
    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const initialLiquidity = helper.ether(4_000_000, PRECISION)
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
    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)
  })

  it("must return true if all products are normal", async () => {
    const [owner] = await ethers.getSigners()
    const coverStatus = await deployed.governance.connect(owner).isCoverNormal(coverKey);
    coverStatus.should.equal(true)
  })

  it("must return false if a product status is not normal", async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(20000))
    const amount = helper.ether(10000)

    const reportingInfo = key.toBytes32('reporting-info')

    await deployed.npm.connect(bob).approve(deployed.governance.address, amount)
    const tx = await deployed.governance.connect(bob).report(coverKey, helper.emptyBytes32, reportingInfo, amount)
    const { events } = await tx.wait()

    await network.provider.send('evm_increaseTime', [1])

    const coverStatus = await deployed.governance.connect(bob).isCoverNormal(coverKey);
    coverStatus.should.equal(false)
  })
})