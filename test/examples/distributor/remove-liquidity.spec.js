/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, helper, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null
const HOURS = 60 * 60
const DAYS = HOURS * 24
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Distributor: `removeLiquidity` function', () => {
  let deployed, treasury, feePercentage, distributor

  beforeEach(async () => {
    deployed = await deployDependencies()

    treasury = helper.randomAddress()
    feePercentage = helper.percentage(20)

    distributor = await deployer.deploy(cache, 'NpmDistributor', deployed.store.address, treasury, feePercentage)

    const coverKey = deployed.coverKey
    const amount = helper.ether(5000, PRECISION)
    const npmStakeToAdd = helper.ether(1000)

    await deployed.npm.approve(distributor.address, ethers.constants.MaxUint256)
    await deployed.dai.approve(distributor.address, ethers.constants.MaxUint256)

    await deployed.cover.setMinStakeToAddLiquidity(helper.ether(250))

    await distributor.addLiquidity({
      coverKey,
      amount,
      npmStakeToAdd,
      referralCode: key.toBytes32('')
    })

    await network.provider.send('evm_increaseTime', [2 * DAYS])

    await deployed.vault.accrueInterest()
  })

  it('must correctly remove liquidity', async () => {
    const [owner] = await ethers.getSigners()
    const coverKey = deployed.coverKey
    const pods = helper.ether(5000)
    const npmStake = helper.ether(500)
    const exit = false

    await deployed.vault.approve(distributor.address, pods)
    const tx = await distributor.removeLiquidity(coverKey, pods, npmStake, exit)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'LiquidityRemoved')

    event.args.coverKey.should.equal(coverKey)
    event.args.account.should.equal(owner.address)
    event.args.amount.should.equal(pods)
    event.args.npmStake.should.equal(npmStake)
    event.args.exit.should.equal(exit)
  })

  it('must correctly exit from the vault', async () => {
    const coverKey = deployed.coverKey
    const pods = helper.ether(5000)
    const npmStake = helper.ether(1000)

    await deployed.vault.approve(distributor.address, pods)

    await distributor.removeLiquidity(coverKey, pods, npmStake, false)
      .should.be.rejectedWith('Can\'t go below min stake')

    await distributor.removeLiquidity(coverKey, pods, npmStake, true)
      .should.not.be.rejected
  })

  it('must reject if invalid cover key is supplied', async () => {
    const pods = helper.ether(5000)
    const npmStake = helper.ether(1000)

    await deployed.vault.approve(distributor.address, pods)

    await distributor.removeLiquidity(key.toBytes32(''), pods, npmStake, false)
      .should.be.rejectedWith('Invalid key')
  })

  it('must reject if zero pods is entered', async () => {
    const coverKey = deployed.coverKey
    const npmStake = helper.ether(1000)

    await distributor.removeLiquidity(coverKey, '0', npmStake, false)
      .should.be.rejectedWith('Invalid amount')
  })

  it('must reject if vault is missing', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.protocol.addMember(owner.address)

    const coverKey = deployed.coverKey
    const pods = helper.ether(5000)
    const npmStake = helper.ether(200)

    await deployed.vault.approve(distributor.address, pods)

    const storeKey = ethers.utils.solidityKeccak256(['bytes32', 'bytes32', 'bytes32'], [key.toBytes32('ns:contracts'), key.toBytes32('cns:cover:vault'), coverKey])
    await deployed.store.deleteAddress(storeKey)

    await distributor.removeLiquidity(coverKey, pods, npmStake, false)
      .should.be.rejectedWith('Fatal: Vault missing')

    await deployed.store.setAddress(storeKey, deployed.vault.address)

    await distributor.removeLiquidity(coverKey, pods, npmStake, false)
      .should.not.be.rejected

    await deployed.protocol.removeMember(owner.address)
  })

  it('must reject if DAI is missing', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.protocol.addMember(owner.address)

    const coverKey = deployed.coverKey
    const pods = helper.ether(5000)
    const npmStake = helper.ether(200)

    await deployed.vault.approve(distributor.address, pods)

    const storeKey = key.toBytes32('cns:cover:sc')
    await deployed.store.deleteAddress(storeKey)

    await distributor.removeLiquidity(coverKey, pods, npmStake, false)
      .should.be.rejectedWith('Fatal: DAI missing')

    await deployed.store.setAddress(storeKey, deployed.dai.address)

    await distributor.removeLiquidity(coverKey, pods, npmStake, false)
      .should.not.be.rejected

    await deployed.protocol.removeMember(owner.address)
  })

  it('must reject if NPM is missing', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.protocol.addMember(owner.address)

    const coverKey = deployed.coverKey
    const pods = helper.ether(5000)
    const npmStake = helper.ether(200)

    await deployed.vault.approve(distributor.address, pods)

    const storeKey = key.toBytes32('cns:core:npm:instance')
    await deployed.store.deleteAddress(storeKey)

    await distributor.removeLiquidity(coverKey, pods, npmStake, false)
      .should.be.rejectedWith('Fatal: NPM missing')

    await deployed.store.setAddress(storeKey, deployed.npm.address)

    await distributor.removeLiquidity(coverKey, pods, npmStake, false)
      .should.not.be.rejected

    await deployed.protocol.removeMember(owner.address)
  })
})
