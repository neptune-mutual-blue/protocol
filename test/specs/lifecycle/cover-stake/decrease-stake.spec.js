/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('CoverStake: decreaseStake', () => {
  let deployed, coverKey
  const stakeWithFee = helper.ether(10_000)

  before(async () => {
    const [owner, alice] = await ethers.getSigners()
    deployed = await deployDependencies()

    deployed.policy = await deployer.deployWithLibraries(cache, 'Policy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      CoverUtilV1: deployed.coverUtilV1.address,
      PolicyHelperV1: deployed.policyHelperV1.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address, '0')

    await deployed.protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY, deployed.policy.address)

    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const initialLiquidity = helper.ether(4_000_000, PRECISION)
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
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

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

    await deployed.protocol.upgradeContract(key.PROTOCOL.CNS.COVER, deployed.cover.address, alice.address)
  })

  it('correctly decreases the stake', async () => {
    const [alice] = await ethers.getSigners()
    const amount = helper.ether(10)

    await deployed.npm.transfer(alice.address, amount)
    await deployed.npm.approve(deployed.stakingContract.address, amount)
    const tx = await deployed.stakingContract.connect(alice).decreaseStake(coverKey, amount)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'StakeRemoved')

    event.args.coverKey.should.equal(coverKey)
    event.args.amount.should.equal(amount)
  })

  it('reverts when amount is greater than your staked amount', async () => {
    const [alice] = await ethers.getSigners()
    const amount = helper.ether(10000)

    await deployed.npm.transfer(alice.address, amount)
    await deployed.npm.approve(deployed.stakingContract.address, amount)
    await deployed.stakingContract.connect(alice).decreaseStake(coverKey, amount)
      .should.be.rejectedWith('Exceeds your drawing power')
  })

  it('reverts when invalid value is passed as amount', async () => {
    const [alice] = await ethers.getSigners()
    const amount = helper.ether(0)

    await deployed.npm.transfer(alice.address, amount)
    await deployed.npm.approve(deployed.stakingContract.address, amount)
    await deployed.stakingContract.connect(alice).decreaseStake(coverKey, amount)
      .should.be.rejectedWith('Please specify amount')
  })
})
