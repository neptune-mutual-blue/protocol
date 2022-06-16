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

describe('CoverReassurance: setWeight', () => {
  let deployed, coverKey, coverReassurance

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const initialLiquidity = helper.ether(4_000_000, PRECISION)
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
    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)

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
    await deployed.npm.approve(deployed.vault.address, minReportingStake)
    await deployed.vault.addLiquidity(coverKey, initialLiquidity, minReportingStake, key.toBytes32(''))

    coverReassurance = deployed.reassuranceContract
  })

  it('correctly sets weight', async () => {
    const weight = helper.percentage(100)
    await coverReassurance.setWeight(coverKey, weight)
  })

  it('reverts when protocol is paused', async () => {
    const weight = helper.percentage(100)
    await deployed.protocol.pause()
    await coverReassurance.setWeight(coverKey, weight)
      .should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when invalid value is passed as cover key', async () => {
    const weight = helper.percentage(100)
    await coverReassurance.setWeight(key.toBytes32('invalid-foo-bar'), weight)
      .should.be.rejectedWith('Cover does not exist')
  })

  it('reverts when invalid value is passed as weight', async () => {
    const weight = '0'
    await coverReassurance.setWeight(coverKey, weight)
      .should.be.rejectedWith('Please specify weight')
  })

  it('reverts when not accessed by the liquidity manager', async () => {
    const [, bob] = await ethers.getSigners()

    const weight = helper.percentage(100)
    await coverReassurance.connect(bob).setWeight(coverKey, weight)
      .should.be.rejectedWith('Forbidden')
  })
})
