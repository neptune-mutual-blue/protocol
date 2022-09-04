/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, helper, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Distributor: `purchasePolicy` function', () => {
  let deployed, treasury, feePercentage, distributor

  before(async () => {
    deployed = await deployDependencies()

    treasury = helper.randomAddress()
    feePercentage = helper.percentage(20)

    distributor = await deployer.deploy(cache, 'NpmDistributor', deployed.store.address, treasury, feePercentage)
  })

  it('must correctly purchase a policy', async () => {
    const [owner] = await ethers.getSigners()
    const coverKey = deployed.coverKey
    const duration = '2'
    const protection = helper.ether(10_000, PRECISION)
    const referralCode = key.toBytes32('referral-code')

    const [premium, fee] = await distributor.getPremium(coverKey, helper.emptyBytes32, duration, protection)

    await deployed.dai.approve(distributor.address, premium.add(fee))
    const tx = await distributor.purchasePolicy(coverKey, helper.emptyBytes32, duration, protection, referralCode)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'PolicySold')

    event.args.coverKey.should.equal(coverKey)
    event.args.account.should.equal(owner.address)
    event.args.cxToken.should.not.equal(helper.zerox)
    event.args.duration.should.equal(duration)
    event.args.protection.should.equal(protection)
    event.args.referralCode.should.equal(referralCode)
    event.args.fee.should.equal(fee)
    event.args.premium.should.equal(premium)
  })

  it('must reject if an invalid cover key is specified', async () => {
    const coverKey = key.toBytes32('')
    const duration = '2'
    const protection = helper.ether(10_000, PRECISION)
    const referralCode = key.toBytes32('referral-code')

    await deployed.dai.approve(distributor.address, ethers.constants.MaxUint256)

    await distributor.purchasePolicy(coverKey, helper.emptyBytes32, duration, protection, referralCode)
      .should.be.rejectedWith('Invalid key')
  })

  it('must reject if an invalid duration is provided', async () => {
    const coverKey = deployed.coverKey
    const duration = '10'
    const protection = helper.ether(10_000, PRECISION)
    const referralCode = key.toBytes32('referral-code')

    await deployed.dai.approve(distributor.address, ethers.constants.MaxUint256)
    await distributor.purchasePolicy(coverKey, helper.emptyBytes32, duration, protection, referralCode)
      .should.be.rejectedWith('Invalid duration')
  })

  it('must reject if an invalid protection amount is provided', async () => {
    const coverKey = deployed.coverKey
    const duration = '2'
    const protection = '0'
    const referralCode = key.toBytes32('referral-code')

    await deployed.dai.approve(distributor.address, ethers.constants.MaxUint256)
    await distributor.purchasePolicy(coverKey, helper.emptyBytes32, duration, protection, referralCode)
      .should.be.rejectedWith('Invalid protection amount')
  })

  it('must reject if an policy contract was not found', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.protocol.addMember(owner.address)

    const coverKey = deployed.coverKey
    const duration = '2'
    const protection = helper.ether(10_000, PRECISION)
    const referralCode = key.toBytes32('referral-code')

    await deployed.dai.approve(distributor.address, ethers.constants.MaxUint256)

    const storeKey = key.qualifyBytes32(key.toBytes32('cns:cover:policy'))
    await deployed.store.deleteAddress(storeKey)

    await distributor.purchasePolicy(coverKey, helper.emptyBytes32, duration, protection, referralCode)
      .should.be.rejectedWith('Fatal: Policy missing')

    await deployed.store.setAddress(storeKey, deployed.policy.address)

    await deployed.protocol.removeMember(owner.address)
  })

  it('must reject if DAI address is not registered on the protocol', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.protocol.addMember(owner.address)

    const coverKey = deployed.coverKey
    const duration = '2'
    const protection = helper.ether(10_000, PRECISION)
    const referralCode = key.toBytes32('referral-code')

    await deployed.dai.approve(distributor.address, ethers.constants.MaxUint256)

    const storeKey = key.toBytes32('cns:cover:sc')
    await deployed.store.deleteAddress(storeKey)

    await distributor.purchasePolicy(coverKey, helper.emptyBytes32, duration, protection, referralCode)
      .should.be.rejectedWith('Fatal: DAI missing')

    await deployed.store.setAddress(storeKey, deployed.dai.address)

    await deployed.protocol.removeMember(owner.address)
  })
})
