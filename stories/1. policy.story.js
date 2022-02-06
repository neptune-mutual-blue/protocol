/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
const { helper, key, ipfs, sample } = require('../util')
const composer = require('../util/composer')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const DAYS = 86400

const coverKey = key.toBytes32('Compound Finance Cover')

/**
 * @type {Contracts}
 */
let contracts = {}

describe('Policy Purchase Stories', () => {
  before(async () => {
    contracts = await composer.initializer.initialize(true)
  })

  it('a new cover `Compound Finance Cover` was created', async () => {
    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const stakeWithFee = helper.ether(10_000)
    const initialReassuranceAmount = helper.ether(1_000_000)
    const initialLiquidity = helper.ether(4_000_000)
    const minReportingStake = helper.ether(250)
    const reportingPeriod = 7 * DAYS

    await contracts.npm.approve(contracts.stakingContract.address, stakeWithFee)
    await contracts.reassuranceToken.approve(contracts.reassuranceContract.address, initialReassuranceAmount)
    await contracts.dai.approve(contracts.cover.address, initialLiquidity)

    await contracts.cover.addCover(coverKey, info, contracts.reassuranceToken.address, [minReportingStake, reportingPeriod, stakeWithFee, initialReassuranceAmount, initialLiquidity])
  })

  it('provision of 1M NPM tokens was added to the `Compound Finance Cover` pool', async () => {
    const [owner] = await ethers.getSigners()
    const provision = helper.ether(1_000_001)

    await contracts.npm.approve(contracts.provisionContract.address, provision)

    await contracts.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, owner.address)
    await contracts.provisionContract.increaseProvision(coverKey, provision)

    await contracts.provisionContract.decreaseProvision(coverKey, helper.ether(1))

    const existing = await contracts.provisionContract.getProvision(coverKey)
    existing.toString().should.equal(helper.ether(1_000_000))
  })

  it('cover pool summary values are accurate', async () => {
    const result = await contracts.policy.getCoverPoolSummary(coverKey)
    const [totalAmountInPool, totalCommitment, provision, npmPrice, reassurance, reassurancePrice, reassuranceWeight] = result

    totalAmountInPool.toString().should.equal(helper.ether(4_000_000))
    totalCommitment.toString().should.equal(helper.ether(0))
    provision.toString().should.equal(helper.ether(1_000_000))
    npmPrice.toString().should.equal(helper.ether(2))
    reassurance.toString().should.equal(helper.ether(1_000_000))
    reassurancePrice.toString().should.equal(helper.ether(1))
    reassuranceWeight.toString().should.equal(helper.percentage(100))
  })

  it('fee should be ~$58.33 xDai when purchasing 10K xDai cover for 1 month', async () => {
    const result = await contracts.policy.getCoverFeeInfo(coverKey, 1, helper.ether(10_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, floor, ceiling, rate, fee } = result

    utilizationRatio.toString().should.equal(helper.ether(0))
    totalAvailableLiquidity.toString().should.equal(helper.ether(7_000_000))

    helper.toPercentageString(coverRatio).should.equal('0.14')
    helper.toPercentageString(floor).should.equal('7.00')
    helper.toPercentageString(ceiling).should.equal('45.00')
    helper.toPercentageString(rate).should.equal('7.00')

    helper.weiToEther(fee).toFixed(2).should.equal('58.33')
  })

  it('fee should be ~$7,255.84 when purchasing 250K xDai cover for 3 months', async () => {
    const result = await contracts.policy.getCoverFeeInfo(coverKey, 3, helper.ether(250_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, floor, ceiling, rate, fee } = result

    utilizationRatio.toString().should.equal(helper.ether(0))
    totalAvailableLiquidity.toString().should.equal(helper.ether(7_000_000))

    helper.toPercentageString(coverRatio).should.equal('10.71')
    helper.toPercentageString(floor).should.equal('7.00')
    helper.toPercentageString(ceiling).should.equal('45.00')
    helper.toPercentageString(rate).should.equal('11.60')

    helper.weiToEther(fee).toFixed(2).should.equal('7250.00')
  })

  it('fee should be ~4095.83 when purchasing 500K xDai cover for 1 month', async () => {
    const result = await contracts.policy.getCoverFeeInfo(coverKey, 1, helper.ether(500_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, rate, fee } = result

    utilizationRatio.toString().should.equal(helper.ether(0))
    totalAvailableLiquidity.toString().should.equal(helper.ether(7_000_000))

    helper.toPercentageString(coverRatio).should.equal('7.14')
    helper.toPercentageString(rate).should.equal('9.83')

    helper.weiToEther(fee).toFixed(2).should.equal('4095.83')
  })

  it('fee should be ~$10633.33 when purchasing 500K xDai cover for 2 months', async () => {
    const result = await contracts.policy.getCoverFeeInfo(coverKey, 2, helper.ether(500_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, rate, fee } = result

    utilizationRatio.toString().should.equal(helper.ether(0))
    totalAvailableLiquidity.toString().should.equal(helper.ether(7_000_000))

    helper.toPercentageString(coverRatio).should.equal('14.28')
    helper.toPercentageString(rate).should.equal('12.76')

    helper.weiToEther(fee).toFixed(2).should.equal('10633.33')
  })

  it('let\'s purchase a policy for `Compound Finance Cover`', async () => {
    const args = [coverKey, 2, helper.ether(500_000)]
    const { fee } = await contracts.policy.getCoverFeeInfo(...args)

   ;(await contracts.policy.getCxToken(args[0], args[1]))[0].should.equal(helper.zerox)

    await contracts.dai.approve(contracts.policy.address, fee)
    await contracts.policy.purchaseCover(...args)

    const { cxToken: cxTokenAddress } = await contracts.policy.getCxToken(args[0], args[1])
    const cxToken = await composer.token.at(cxTokenAddress)

    const [owner] = await ethers.getSigners()
    const cBal = await cxToken.balanceOf(owner.address)

    cBal.toString().should.equal(args[2].toString())
  })
})
