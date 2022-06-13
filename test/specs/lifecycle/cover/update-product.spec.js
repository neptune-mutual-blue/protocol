/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const composer = require('../../../../util/composer')
const DAYS = 86400
const HOURS = 60 * 60

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: updateProduct', () => {
  let deployed

  const coverKey = key.toBytes32('foo-bar')
  const productKey = key.toBytes32('test-product-key')
  const stakeWithFee = helper.ether(10_000)
  const initialReassuranceAmount = helper.ether(1_000_000)
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

  const coverValues = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]
  const productValues = [1, 10_000]

  before(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', true, requiresWhitelist, coverValues)
    await deployed.cover.addProduct(coverKey, productKey, info, requiresWhitelist, productValues)

    const initialLiquidity = helper.ether(4_000_000)
    const lendingPeriod = 1 * HOURS
    const withdrawalWindow = 1 * HOURS

    const vault = await composer.vault.getVault({
      store: deployed.store,
      libs: {
        accessControlLibV1: deployed.accessControlLibV1,
        baseLibV1: deployed.baseLibV1,
        transferLib: deployed.transferLib,
        protoUtilV1: deployed.protoUtilV1,
        registryLibV1: deployed.registryLibV1,
        validationLibV1: deployed.validationLibV1
      }
    }, coverKey)
    await deployed.liquidityEngine.setLendingPeriods(coverKey, lendingPeriod, withdrawalWindow)
    await deployed.dai.approve(vault.address, initialLiquidity)
    await deployed.npm.approve(vault.address, minReportingStake)
    await vault.addLiquidity(coverKey, initialLiquidity, minReportingStake, key.toBytes32(''))
    await network.provider.send('evm_increaseTime', [1 * HOURS])
  })

  it('correctly update product when accessed by cover creator', async () => {
    await deployed.cover.updateProduct(coverKey, productKey, info, productValues)
  })

  it('reverts when tried to update a retired product', async () => {
    await deployed.cover.addProduct(coverKey, key.toBytes32('retired-product'), info, requiresWhitelist, productValues)
    await deployed.cover.updateProduct(coverKey, key.toBytes32('retired-product'), info, [2, 10_000])
    await deployed.cover.updateProduct(coverKey, key.toBytes32('retired-product'), info, [1, 10_000]).should.be.rejectedWith('Product retired or deleted')
  })

  it('reverts when tried to update a deleted product', async () => {
    await deployed.cover.addProduct(coverKey, key.toBytes32('deleted-product'), info, requiresWhitelist, productValues)
    await deployed.cover.updateProduct(coverKey, key.toBytes32('deleted-product'), info, [0, 10_000])
    await deployed.cover.updateProduct(coverKey, key.toBytes32('deleted-product'), info, [1, 10_000]).should.be.rejectedWith('Product retired or deleted')
  })

  it('reverts when efficiency is invalid', async () => {
    await deployed.cover.updateProduct(coverKey, productKey, info, [1, 0]).should.be.rejectedWith('Invalid efficiency')
    await deployed.cover.updateProduct(coverKey, productKey, info, [1, 10_001]).should.be.rejectedWith('Invalid efficiency')
  })

  it('reverts when status is invalid', async () => {
    await deployed.cover.updateProduct(coverKey, productKey, info, [3, 100]).should.be.rejectedWith('Invalid product status')
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()
    await deployed.cover.updateProduct(coverKey, key.toBytes32(''), info, productValues)
      .should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })
})
