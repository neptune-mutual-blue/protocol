/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
require('chai').use(require('chai-as-promised')).use(require('chai-bignumber')(BigNumber)).should()
const { helper, key, ipfs, sample } = require('../util')
const composer = require('./composer')
const day = 86400

const coverKey = key.toBytes32('Compound Finance Cover')

let contracts = {
  assuranceToken: null,
  nep: null,
  wxDai: null,
  store: null,
  storeKeyUtil: null,
  protoUtilV1: null,
  protocol: null,
  cover: null,
  stakingContract: null,
  assuranceContract: null,
  provisionContract: null,
  policyAdminContract: null,
  policy: null,
  coverUtil: null,
  vaultFactory: null,
  transferLib: null,
  dateLib: null
}

describe('Policy Purchase Stories', () => {
  before(async () => {
    contracts = await composer.initializer.initialize()
  })

  it('a new cover `Compound Finance Cover` was created', async () => {
    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const stakeWithFee = helper.ether(10_000)
    const initialAssuranceAmount = helper.ether(1_000_000)
    const initialLiquidity = helper.ether(4_000_000)
    const reportingPeriod = 7 * day

    await contracts.nep.approve(contracts.stakingContract.address, stakeWithFee)
    await contracts.assuranceToken.approve(contracts.assuranceContract.address, initialAssuranceAmount)
    await contracts.wxDai.approve(contracts.cover.address, initialLiquidity)

    await contracts.cover.addCover(coverKey, info, reportingPeriod, stakeWithFee, contracts.assuranceToken.address, initialAssuranceAmount, initialLiquidity)
  })

  it('provision of 1M NEP tokens was added to the `Compound Finance Cover` pool', async () => {
    const provision = helper.ether(1_000_001)

    await contracts.nep.approve(contracts.provisionContract.address, provision)
    await contracts.provisionContract.increaseProvision(coverKey, provision)

    await contracts.provisionContract.decreaseProvision(coverKey, helper.ether(1))

    const existing = await contracts.provisionContract.getProvision(coverKey)
    existing.should.equal(helper.ether(1_000_000))
  })

  it('cover pool summary values are accurate', async () => {
    const result = await contracts.policy.getCoverPoolSummary(coverKey)
    const [totalAmountInPool, totalCommitment, provision, nepPrice, assurance, assurancePrice, assuranceWeight] = result

    totalAmountInPool.should.equal(helper.ether(4_000_000))
    totalCommitment.should.equal(helper.ether(0))
    provision.should.equal(helper.ether(1_000_000))
    nepPrice.should.equal(helper.ether(1))
    assurance.should.equal(helper.ether(1_000_000))
    assurancePrice.should.equal(helper.ether(1))
    assuranceWeight.should.equal(helper.ether(0.5))
  })

  it('fee should be ~$58.33 xDai when purchasing 10K xDai cover for 1 month', async () => {
    const result = await contracts.policy.getCoverFee(coverKey, 1, helper.ether(10_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, floor, ceiling, rate, fee } = result

    utilizationRatio.should.equal(helper.ether(0))
    totalAvailableLiquidity.should.equal(helper.ether(5_500_000))

    helper.weiToEther(coverRatio).toFixed(4).should.equal('0.0018') // 0.18%
    helper.weiToEther(floor).toFixed(4).should.equal('0.0700') // 7%
    helper.weiToEther(ceiling).toFixed(4).should.equal('0.4500') // 45%
    helper.weiToEther(rate).toFixed(4).should.equal('0.0700') // 7%

    helper.weiToEther(fee).toFixed(2).should.equal('58.33')
  })

  it('fee should be ~$7,864.51 when purchasing 250K xDai cover for 3 months', async () => {
    const result = await contracts.policy.getCoverFee(coverKey, 3, helper.ether(250_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, floor, ceiling, rate, fee } = result

    utilizationRatio.should.equal(helper.ether(0))
    totalAvailableLiquidity.should.equal(helper.ether(5_500_000))

    helper.weiToEther(coverRatio).toFixed(4).should.equal('0.1364') // 13.64%
    helper.weiToEther(floor).toFixed(4).should.equal('0.0700') // 7%
    helper.weiToEther(ceiling).toFixed(4).should.equal('0.4500') // 45%
    helper.weiToEther(rate).toFixed(4).should.equal('0.1258') // 12.58%

    helper.weiToEther(fee).toFixed(2).should.equal('7864.51')
  })

  it('fee should be ~$4,544.14 when purchasing 500K xDai cover for 1 month', async () => {
    const result = await contracts.policy.getCoverFee(coverKey, 1, helper.ether(500_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, floor, ceiling, rate, fee } = result

    utilizationRatio.should.equal(helper.ether(0))
    totalAvailableLiquidity.should.equal(helper.ether(5_500_000))

    helper.weiToEther(coverRatio).toFixed(4).should.equal('0.0909') // 9.09%
    helper.weiToEther(floor).toFixed(4).should.equal('0.0700') // 7%
    helper.weiToEther(ceiling).toFixed(4).should.equal('0.4500') // 45%
    helper.weiToEther(rate).toFixed(4).should.equal('0.1091') // 10.91%

    helper.weiToEther(fee).toFixed(2).should.equal('4544.14')
  })

  it('fee should be ~$11,359.54 when purchasing 500K xDai cover for 2 months', async () => {
    const result = await contracts.policy.getCoverFee(coverKey, 2, helper.ether(500_000))
    const { utilizationRatio, totalAvailableLiquidity, coverRatio, floor, ceiling, rate, fee } = result

    utilizationRatio.should.equal(helper.ether(0))
    totalAvailableLiquidity.should.equal(helper.ether(5_500_000))

    helper.weiToEther(coverRatio).toFixed(4).should.equal('0.1818') // 18.18%
    helper.weiToEther(floor).toFixed(4).should.equal('0.0700') // 7%
    helper.weiToEther(ceiling).toFixed(4).should.equal('0.4500') // 45%
    helper.weiToEther(rate).toFixed(4).should.equal('0.1363') // 13.63%

    helper.weiToEther(fee).toFixed(2).should.equal('11359.54')
  })

  it('let\'s purchase a policy for `Compound Finance Cover`', async () => {
    const args = [coverKey, 2, helper.ether(500_000)]
    const { fee } = await contracts.policy.getCoverFee(...args)

   ;(await contracts.policy.getCToken(args[0], args[1]))[0].should.equal(helper.zerox)

    await contracts.wxDai.approve(contracts.policy.address, fee)
    await contracts.policy.purchaseCover(...args)

    const { cToken: cTokenAddress } = await contracts.policy.getCToken(args[0], args[1])
    const cToken = await composer.token.at(cTokenAddress)

    const [owner] = await ethers.getSigners()
    const cBal = await cToken.balanceOf(owner.address)

    cBal.should.equal(args[2].toString())
  })
})
