/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
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

describe('CoverReassurance: addReassurance', () => {
  let deployed, coverKey, coverReassurance

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const initialLiquidity = helper.ether(4_000_000, PRECISION)
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

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
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
    })

    deployed.vault = await composer.vault.getVault({
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

    await deployed.dai.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minStakeToReport)
    await deployed.vault.addLiquidity(coverKey, initialLiquidity, minStakeToReport, key.toBytes32(''))

    coverReassurance = deployed.reassuranceContract
  })

  it('correctly adds reassurance', async () => {
    const amount = helper.ether(1, PRECISION)

    await deployed.dai.approve(deployed.reassuranceContract.address, amount)
    const tx = await coverReassurance.addReassurance(coverKey, helper.randomAddress(), amount)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'ReassuranceAdded')

    event.args.coverKey.should.equal(coverKey)
    event.args.amount.should.equal(amount)
  })

  it('reverts when protocol is paused', async () => {
    const amount = helper.ether(1, PRECISION)
    await deployed.protocol.pause()
    await coverReassurance.addReassurance(coverKey, helper.randomAddress(), amount)
      .should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when invalid value is passed as cover key', async () => {
    const amount = helper.ether(1, PRECISION)
    await coverReassurance.addReassurance(key.toBytes32('invalid-foo-bar'), helper.randomAddress(), amount)
      .should.be.rejectedWith('Cover does not exist')
  })

  it('reverts when invalid value is passed as amount', async () => {
    const amount = '0'
    await coverReassurance.addReassurance(coverKey, helper.randomAddress(), amount)
      .should.be.rejectedWith('Provide valid amount')
  })

  it('reverts when not accessed by the liquidity manager', async () => {
    const [, bob] = await ethers.getSigners()

    const amount = helper.ether(1, PRECISION)
    await coverReassurance.connect(bob).addReassurance(coverKey, helper.randomAddress(), amount)
      .should.be.rejectedWith('Forbidden')
  })
})
