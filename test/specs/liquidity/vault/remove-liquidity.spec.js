/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers, network } = require('hardhat')
const { helper, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const { deployDependencies } = require('./deps')
const HOURS = 60 * 60
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault: removeLiquidity (Dedicated Cover)', () => {
  let deployed, coverKey, npmStake

  beforeEach(async () => {
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')

    const lendingPeriod = 1 * HOURS
    const withdrawalWindow = 1 * HOURS

    await deployed.liquidityEngine.setLendingPeriods(coverKey, lendingPeriod, withdrawalWindow)

    const amount = helper.ether(10_000_000, PRECISION)
    npmStake = helper.ether(500)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(deployed.vault.address, npmStake)
    await deployed.dai.approve(deployed.vault.address, amount)

    await deployed.vault.addLiquidity(coverKey, amount, npmStake, referralCode)
  })

  it('reverts when tried to exit without removing total NPM stake', async () => {
    await network.provider.send('evm_increaseTime', [1 * HOURS])
    await deployed.vault.accrueInterest()

    const pods = helper.ether(2000)
    await deployed.vault.approve(deployed.vault.address, pods)

    await deployed.vault.removeLiquidity(coverKey, pods, npmStake, true)
      .should.be.rejectedWith('Invalid NPM stake to exit')
  })

  it('successfully removes liquidity', async () => {
    const totalNPMStake = helper.add(npmStake, deployed.minReportingStake)

    await network.provider.send('evm_increaseTime', [1 * HOURS])
    await deployed.vault.accrueInterest()

    const [owner] = await ethers.getSigners()
    const pods = helper.ether(2000)
    await deployed.vault.approve(deployed.vault.address, pods)

    const tx = await deployed.vault.removeLiquidity(coverKey, pods, totalNPMStake, true)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'PodsRedeemed')

    event.args.account.should.equal(owner.address)
    event.args.redeemed.should.equal(helper.ether(2000))
    event.args.liquidityReleased.should.equal(helper.ether(2000, PRECISION))
  })

  it('successfully removes liquidity without NPM stake removal', async () => {
    await network.provider.send('evm_increaseTime', [1 * HOURS])
    await deployed.vault.accrueInterest()

    const pods = helper.ether(2000)
    await deployed.vault.approve(deployed.vault.address, pods)

    await deployed.vault.removeLiquidity(coverKey, pods, '0', false)
  })

  it('reverts when coverkey is invalid', async () => {
    await network.provider.send('evm_increaseTime', [1 * HOURS])
    await deployed.vault.accrueInterest()

    const pods = helper.ether(1_000)
    await deployed.vault.approve(deployed.vault.address, pods)

    await deployed.vault.removeLiquidity(key.toBytes32('foobar'), pods, npmStake, false)
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when invalid amount is supplied', async () => {
    await network.provider.send('evm_increaseTime', [1 * HOURS])
    await deployed.vault.accrueInterest()

    const pods = helper.ether(0)
    await deployed.vault.approve(deployed.vault.address, pods)

    await deployed.vault.removeLiquidity(coverKey, pods, npmStake, false)
      .should.be.rejectedWith('Please specify amount')
  })

  it('reverts when withdrawal window is closed', async () => {
    await network.provider.send('evm_increaseTime', [1 * HOURS])
    await deployed.vault.accrueInterest()

    const pods = helper.ether(2000)
    await deployed.vault.approve(deployed.vault.address, pods)

    await network.provider.send('evm_increaseTime', [1 * HOURS])

    await deployed.vault.removeLiquidity(coverKey, pods, '0', false)
      .should.be.rejectedWith('Withdrawal period has already ended')
  })

  it('reverts when withdrawal window has not begun', async () => {
    const pods = helper.ether(2000)
    await deployed.vault.approve(deployed.vault.address, pods)

    await deployed.vault.removeLiquidity(coverKey, pods, '0', false)
      .should.be.rejectedWith('Withdrawal period has not started')
  })
})

describe.only('Vault: removeLiquidity (Diversified Cover)', () => {
  let deployed, vault

  const coverKey = key.toBytes32('foo-bar-2')
  const productKey = key.toBytes32('test')
  const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
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
  const info = key.toBytes32('info')

  const lendingPeriod = 1 * HOURS
  const withdrawalWindow = 1 * HOURS
  const npmStake = helper.ether(500)

  before(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]
    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', true, requiresWhitelist, values)

    await deployed.cover.addProduct(coverKey, productKey, info, requiresWhitelist, [1, 10_000])

    vault = await composer.vault.getVault({
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
  })

  beforeEach(async () => {
    await deployed.liquidityEngine.setLendingPeriods(coverKey, lendingPeriod, withdrawalWindow)

    const amount = helper.ether(10_000_000, PRECISION)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(vault.address, npmStake)
    await deployed.dai.approve(vault.address, amount)

    await vault.addLiquidity(coverKey, amount, npmStake, referralCode)
  })

  it('successfully removes liquidity', async () => {
    await network.provider.send('evm_increaseTime', [1 * HOURS])
    await vault.accrueInterest()

    const [owner] = await ethers.getSigners()
    const pods = helper.ether(2000)
    await vault.approve(vault.address, pods)

    const tx = await vault.removeLiquidity(coverKey, pods, npmStake, true)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'PodsRedeemed')

    event.args.account.should.equal(owner.address)
    event.args.redeemed.should.equal(helper.ether(2000))
    event.args.liquidityReleased.should.equal(helper.ether(2000, PRECISION))

    await network.provider.send('evm_increaseTime', [1 * HOURS])
  })

  it('successfully removes liquidity second time', async () => {
    await network.provider.send('evm_increaseTime', [1 * HOURS])
    await vault.accrueInterest()

    const pods = helper.ether(2000)
    await vault.approve(vault.address, pods)

    // Report
    const reportingStake = helper.ether(10000)
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, reportingStake)
    await deployed.governance.report(coverKey, productKey, reportingInfo, reportingStake)

    await vault.removeLiquidity(coverKey, pods, npmStake, true)
      .should.be.rejectedWith('Status not normal')

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, productKey)

    // Cleanup - resolve, finalize
    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS + 11])
    await deployed.resolution.resolve(coverKey, productKey, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS + 1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS + 1])
    await deployed.resolution.finalize(coverKey, productKey, incidentDate)

    await network.provider.send('evm_increaseTime', [1 * HOURS])
  })
})
