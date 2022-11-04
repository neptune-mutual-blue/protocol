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

describe('Distributor: `addLiquidity` function', () => {
  let deployed, treasury, feePercentage, distributor

  before(async () => {
    deployed = await deployDependencies()

    treasury = helper.randomAddress()
    feePercentage = helper.percentage(20)

    distributor = await deployer.deploy(cache, 'NpmDistributor', deployed.store.address, treasury, feePercentage)
  })

  it('must correctly add liquidity', async () => {
    const [owner] = await ethers.getSigners()
    const coverKey = deployed.coverKey
    const amount = helper.ether(5000, PRECISION)
    const npmStakeToAdd = helper.ether(1000)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(distributor.address, npmStakeToAdd)
    await deployed.stablecoin.approve(distributor.address, amount)

    const tx = await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    })

    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'LiquidityAdded')

    event.args.coverKey.should.equal(coverKey)
    event.args.account.should.equal(owner.address)
    event.args.referralCode.should.equal(referralCode)
    event.args.amount.should.equal(amount)
    event.args.npmStake.should.equal(npmStakeToAdd)
  })

  it('must not need NPM stake for additional liquidity', async () => {
    const [, alice] = await ethers.getSigners()
    const coverKey = deployed.coverKey
    const amount = helper.ether(5000, PRECISION)
    const npmStakeToAdd = '0'
    const referralCode = key.toBytes32('referral-code')

    await deployed.stablecoin.approve(distributor.address, amount)
    await deployed.stablecoin.connect(alice).approve(distributor.address, amount)

    await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    }).should.not.be.rejected

    await distributor.connect(alice).addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    }).should.be.rejected
  })

  it('must reject if invalid cover key is specified', async () => {
    const amount = helper.ether(5000, PRECISION)
    const npmStakeToAdd = helper.ether(1000)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(distributor.address, npmStakeToAdd)
    await deployed.stablecoin.approve(distributor.address, amount)

    await distributor.addLiquidity({
      coverKey: key.toBytes32(''),
      amount,
      npmStakeToAdd,
      referralCode
    }).should.be.rejectedWith('Invalid key')
  })

  it('must reject if the supplied amount is zero', async () => {
    const coverKey = deployed.coverKey
    const amount = '0'
    const npmStakeToAdd = helper.ether(1000, PRECISION)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(distributor.address, npmStakeToAdd)

    await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    }).should.be.rejectedWith('Invalid amount')
  })

  it('must reject if vault contract was not found', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.protocol.addMember(owner.address)

    const coverKey = deployed.coverKey
    const amount = helper.ether(5000, PRECISION)
    const npmStakeToAdd = helper.ether(1000)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(distributor.address, npmStakeToAdd)
    await deployed.stablecoin.approve(distributor.address, amount)

    const storeKey = ethers.utils.solidityKeccak256(['bytes32', 'bytes32', 'bytes32'], [key.toBytes32('ns:contracts'), key.toBytes32('cns:cover:vault'), coverKey])
    await deployed.store.deleteAddress(storeKey)

    await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    }).should.be.rejectedWith('Fatal: Vault missing')

    await deployed.store.setAddress(storeKey, deployed.vault.address)

    await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    }).should.not.be.rejected

    await deployed.protocol.removeMember(owner.address)
  })

  it('must reject if stablecoin was not found', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.protocol.addMember(owner.address)

    const coverKey = deployed.coverKey
    const amount = helper.ether(5000, PRECISION)
    const npmStakeToAdd = helper.ether(1000)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(distributor.address, ethers.constants.MaxUint256)
    await deployed.stablecoin.approve(distributor.address, ethers.constants.MaxUint256)

    const storeKey = key.toBytes32('cns:cover:sc')
    await deployed.store.deleteAddress(storeKey)

    await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    }).should.be.rejectedWith('Fatal: Stablecoin missing')

    await deployed.store.setAddress(storeKey, deployed.stablecoin.address)

    await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    }).should.not.be.rejected

    await deployed.protocol.removeMember(owner.address)
  })

  it('must reject if NPM was not found', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.protocol.addMember(owner.address)

    const coverKey = deployed.coverKey
    const amount = helper.ether(5000, PRECISION)
    const npmStakeToAdd = helper.ether(1000)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(distributor.address, ethers.constants.MaxUint256)
    await deployed.stablecoin.approve(distributor.address, ethers.constants.MaxUint256)

    const storeKey = key.toBytes32('cns:core:npm:instance')
    await deployed.store.deleteAddress(storeKey)

    await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    }).should.be.rejectedWith('Fatal: NPM missing')

    await deployed.store.setAddress(storeKey, deployed.npm.address)

    await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode
    }).should.not.be.rejected

    await deployed.protocol.removeMember(owner.address)
  })
})
