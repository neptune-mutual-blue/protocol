/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault: addLiquidity (Dedicated Cover)', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly adds liquidity', async () => {
    const coverKey = key.toBytes32('foo-bar')
    const amount = helper.ether(1_000, PRECISION)
    const npmStake = helper.ether(500)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(deployed.vault.address, npmStake)
    await deployed.dai.approve(deployed.vault.address, amount)

    const tx = await deployed.vault.addLiquidity(coverKey, amount, npmStake, referralCode)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'PodsIssued')
    event.args.referralCode.should.equal(referralCode)
  })

  it('correctly adds liquidity without NPM stake', async () => {
    const coverKey = key.toBytes32('foo-bar')
    const amount = '100'
    const npmStake = helper.ether(0)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(deployed.vault.address, npmStake)
    await deployed.dai.approve(deployed.vault.address, amount)

    await deployed.vault.addLiquidity(coverKey, amount, npmStake, referralCode)
      .should.not.be.rejected
  })

  it('reverts when coverkey is invalid', async () => {
    const coverKey = key.toBytes32('foo-bar2')
    const amount = helper.ether(1_000, PRECISION)
    const npmStake = helper.ether(500)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(deployed.vault.address, npmStake)
    await deployed.dai.approve(deployed.vault.address, amount)

    await deployed.vault.addLiquidity(coverKey, amount, npmStake, referralCode)
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when invalid amount is supplied', async () => {
    const coverKey = key.toBytes32('foo-bar')
    const amount = helper.ether(0)
    const npmStake = helper.ether(1)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(deployed.vault.address, npmStake)
    await deployed.dai.approve(deployed.vault.address, amount)

    await deployed.vault.addLiquidity(coverKey, amount, npmStake, referralCode)
      .should.be.rejectedWith('Please specify amount')
  })
})

describe('Vault: addLiquidity (Diversified Cover)', () => {
  let deployed, vault

  const coverKey = key.toBytes32('foo-bar-2')
  const productKey = key.toBytes32('test')
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

  const requiresWhitelist = false
  const info = key.toBytes32('info')

  before(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()

    await deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
      coverKey,
      info,
      tokenName: 'POD',
      tokenSymbol: 'POD',
      supportsProducts: true,
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
    })

    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    })

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

  it('correctly adds liquidity', async () => {
    const amount = helper.ether(1_000, PRECISION)
    const npmStake = helper.ether(500)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(vault.address, npmStake)
    await deployed.dai.approve(vault.address, amount)

    const tx = await vault.addLiquidity(coverKey, amount, npmStake, referralCode)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'PodsIssued')
    event.args.referralCode.should.equal(referralCode)
  })

  it('reverts when the product is being reported', async () => {
    const [, bob] = await ethers.getSigners()

    const reportingStake = helper.ether(10000)
    const reportingInfo = key.toBytes32('reporting-info')

    await deployed.npm.transfer(bob.address, helper.ether(20000))
    await deployed.npm.connect(bob).approve(deployed.governance.address, reportingStake)
    await deployed.governance.connect(bob).report(coverKey, productKey, reportingInfo, reportingStake)

    const amount = helper.ether(1_000, PRECISION)
    const npmStake = helper.ether(500)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.connect(bob).approve(vault.address, npmStake)
    await deployed.dai.connect(bob).approve(vault.address, amount)

    await vault.connect(bob).addLiquidity(coverKey, amount, npmStake, referralCode)
      .should.be.rejectedWith('Status not normal')
  })
})
