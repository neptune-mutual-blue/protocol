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
    await contracts.wxDai.approve(contracts.cover.address, initialLiquidity)

    await contracts.cover.addCover(coverKey, info, minReportingStake, reportingPeriod, stakeWithFee, contracts.reassuranceToken.address, initialReassuranceAmount, initialLiquidity)
  })

  it('provision of 1M NPM tokens was added to the `Compound Finance Cover` pool', async () => {
    const [owner] = await ethers.getSigners()
    const provision = helper.ether(1_000_001)

    await contracts.npm.approve(contracts.provisionContract.address, provision)

    await contracts.protocol.grantRole(key.NS.ROLES.LIQUIDITY_MANAGER, owner.address)
    await contracts.provisionContract.increaseProvision(coverKey, provision)

    await contracts.provisionContract.decreaseProvision(coverKey, helper.ether(1))

    const existing = await contracts.provisionContract.getProvision(coverKey)
    existing.should.equal(helper.ether(1_000_000))
  })

  it('cover pool summary values are accurate', async () => {
    const result = await contracts.policy.getCoverPoolSummary(coverKey)
    const [totalAmountInPool, totalCommitment, provision, nepPrice, reassurance, reassurancePrice, reassuranceWeight] = result

    totalAmountInPool.should.equal(helper.ether(4_000_000))
    totalCommitment.should.equal(helper.ether(0))
    provision.should.equal(helper.ether(1_000_000))
    nepPrice.should.equal(helper.ether(1))
    reassurance.should.equal(helper.ether(1_000_000))
    reassurancePrice.should.equal(helper.ether(1))
    reassuranceWeight.should.equal(helper.ether(1))
  })

  it('fee should be ~$58.33 xDai when purchasing 10K xDai cover for 1 month', async () => {
    const result = await contracts.policy.getCoverFee(coverKey, 1, helper.ether(10_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, floor, ceiling, rate, fee } = result

    utilizationRatio.should.equal(helper.ether(0))
    totalAvailableLiquidity.should.equal(helper.ether(6_000_000))

    helper.weiToEther(coverRatio).toFixed(4).should.equal('0.0017') // 0.17%
    helper.weiToEther(floor).toFixed(4).should.equal('0.0700') // 7%
    helper.weiToEther(ceiling).toFixed(4).should.equal('0.4500') // 45%
    helper.weiToEther(rate).toFixed(4).should.equal('0.0700') // 7%

    helper.weiToEther(fee).toFixed(2).should.equal('58.33')
  })

  it('fee should be ~$7,650.58 when purchasing 250K xDai cover for 3 months', async () => {
    const result = await contracts.policy.getCoverFee(coverKey, 3, helper.ether(250_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, rate, fee } = result

    utilizationRatio.should.equal(helper.ether(0))
    totalAvailableLiquidity.should.equal(helper.ether(6_000_000))

    helper.weiToEther(coverRatio).toFixed(4).should.equal('0.1250') // 12.50%
    helper.weiToEther(rate).toFixed(4).should.equal('0.1224') // 12.24%

    helper.weiToEther(fee).toFixed(2).should.equal('7650.58')
  })

  it('fee should be ~$4,384.74 when purchasing 500K xDai cover for 1 month', async () => {
    const result = await contracts.policy.getCoverFee(coverKey, 1, helper.ether(500_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, rate, fee } = result

    utilizationRatio.should.equal(helper.ether(0))
    totalAvailableLiquidity.should.equal(helper.ether(6_000_000))

    helper.weiToEther(coverRatio).toFixed(4).should.equal('0.0833') // 8.33%
    helper.weiToEther(rate).toFixed(4).should.equal('0.1052') // 10.52%

    helper.weiToEther(fee).toFixed(2).should.equal('4384.74')
  })

  it('fee should be ~$11,107.19 when purchasing 500K xDai cover for 2 months', async () => {
    const result = await contracts.policy.getCoverFee(coverKey, 2, helper.ether(500_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, rate, fee } = result

    utilizationRatio.should.equal(helper.ether(0))
    totalAvailableLiquidity.should.equal(helper.ether(6_000_000))

    helper.weiToEther(coverRatio).toFixed(4).should.equal('0.1667') // 16.67%
    helper.weiToEther(rate).toFixed(4).should.equal('0.1333') // 13.63%

    helper.weiToEther(fee).toFixed(2).should.equal('11107.19')
  })

  it('let\'s purchase a policy for `Compound Finance Cover`', async () => {
    const args = [coverKey, 2, helper.ether(500_000)]
    const { fee } = await contracts.policy.getCoverFee(...args)

   ;(await contracts.policy.getCxToken(args[0], args[1]))[0].should.equal(helper.zerox)

    await contracts.wxDai.approve(contracts.policy.address, fee)
    await contracts.policy.purchaseCover(...args)

    const { cxToken: cxTokenAddress } = await contracts.policy.getCxToken(args[0], args[1])
    const cxToken = await composer.token.at(cxTokenAddress)

    const [owner] = await ethers.getSigners()
    const cBal = await cxToken.balanceOf(owner.address)

    cBal.should.equal(args[2].toString())
  })
})
