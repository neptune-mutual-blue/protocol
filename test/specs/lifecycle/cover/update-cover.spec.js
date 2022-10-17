/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const HOURS = 60 * 60
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: updateCover', () => {
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

  beforeEach(async () => {
    const lendingPeriod = 1 * HOURS
    const withdrawalWindow = 2 * HOURS
    await deployed.liquidityEngine.setRiskPoolingPeriods(helper.emptyBytes32, lendingPeriod, withdrawalWindow)
  })

  it('correctly updates cover', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover(args)

    const initialLiquidity = helper.ether(4_000_000, PRECISION)

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

    await deployed.dai.approve(vault.address, ethers.constants.MaxUint256)
    await deployed.npm.approve(vault.address, ethers.constants.MaxUint256)
    await vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })

    await vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })

    await network.provider.send('evm_increaseTime', [1 * HOURS])

    const updatedInfo = key.toBytes32('updated-info')
    await deployed.cover.updateCover(coverKey, updatedInfo)
  })

  it('reverts when the info is not changed', async () => {
    const coverKey = key.toBytes32('foo-bar-2')
    const [owner] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
      ...args,
      coverKey
    })

    const initialLiquidity = helper.ether(4_000_000, PRECISION)
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

    await deployed.liquidityEngine.setRiskPoolingPeriods(coverKey, lendingPeriod, withdrawalWindow)
    await deployed.dai.approve(vault.address, initialLiquidity)
    await deployed.npm.approve(vault.address, minStakeToReport)
    await vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
    await network.provider.send('evm_increaseTime', [1 * HOURS])

    const updatedInfo = key.toBytes32('info')
    await deployed.cover.updateCover(coverKey, updatedInfo)
      .should.be.rejectedWith('Duplicate content')
  })

  it('reverts when accessed outside withdrawal window', async () => {
    const coverKey = key.toBytes32('foo-bar-3')
    const [owner] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
      ...args,
      coverKey
    })

    const initialLiquidity = helper.ether(4_000_000, PRECISION)
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

    await deployed.liquidityEngine.setRiskPoolingPeriods(coverKey, lendingPeriod, withdrawalWindow)
    await deployed.dai.approve(vault.address, initialLiquidity)
    await deployed.npm.approve(vault.address, minStakeToReport)
    await vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })

    const updatedInfo = key.toBytes32('updated-info')
    await deployed.cover.updateCover(coverKey, updatedInfo)
      .should.be.rejectedWith('Withdrawal period has not started')

    await network.provider.send('evm_increaseTime', [3 * HOURS])

    await deployed.cover.updateCover(coverKey, updatedInfo)
      .should.be.rejectedWith('Withdrawal period has already ended')
  })

  it('reverts when not accessed by GovernanceAdmin', async () => {
    const [owner, bob] = await ethers.getSigners()

    await deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    const updatedInfo = key.toBytes32('updated-info')
    await deployed.cover.connect(bob).updateCover(coverKey, updatedInfo)
      .should.be.rejectedWith('Forbidden')
  })
})
