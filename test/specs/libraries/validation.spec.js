/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const composer = require('../../../util/composer')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('ValidationLibV1: senderMustBePolicyManagerContract', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockValidationLibUser',
      { ValidationLibV1: deployed.validationLibV1.address },
      deployed.store.address
    )
  })

  it('must validate sender correctly', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY_MANAGER, bob.address)
    await mockContract.connect(bob).senderMustBePolicyManagerContract()
  })

  it('revert when not accessed by PolicyManagerContract', async () => {
    await mockContract.senderMustBePolicyManagerContract()
      .should.be.rejectedWith('Access denied')
  })
})

describe('ValidationLibV1: senderMustBeGovernanceContract', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockValidationLibUser',
      { ValidationLibV1: deployed.validationLibV1.address },
      deployed.store.address
    )
  })

  it('must validate sender correctly', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.protocol.upgradeContract(key.PROTOCOL.CNS.GOVERNANCE, deployed.governance.address, bob.address)
    await mockContract.connect(bob).senderMustBeGovernanceContract()
  })

  it('revert when not accessed by GovernanceContract', async () => {
    await mockContract.senderMustBeGovernanceContract()
      .should.be.rejectedWith('Access denied')
  })
})

describe('ValidationLibV1: senderMustBeClaimsProcessorContract', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockValidationLibUser',
      { ValidationLibV1: deployed.validationLibV1.address },
      deployed.store.address
    )
  })

  it('must validate sender correctly', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.protocol.addContract(key.PROTOCOL.CNS.CLAIM_PROCESSOR, bob.address)
    await mockContract.connect(bob).senderMustBeClaimsProcessorContract()
  })

  it('revert when not accessed by ClaimsProcessorContract', async () => {
    await mockContract.senderMustBeClaimsProcessorContract()
      .should.be.rejectedWith('Access denied')
  })
})

describe('ValidationLibV1: senderMustBeStrategyContract', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockValidationLibUser',
      { ValidationLibV1: deployed.validationLibV1.address },
      deployed.store.address
    )
  })

  it('revert when not accessed by StrategyContract', async () => {
    await mockContract.senderMustBeStrategyContract()
      .should.be.rejectedWith('Not a strategy contract')
  })
})

describe('ValidationLibV1: mustBeDisputed', () => {
  let deployed, mockContract, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const stakeWithFee = helper.ether(10_000)
    const initialReassuranceAmount = helper.ether(1_000_000)
    const initialLiquidity = helper.ether(4_000_000)
    const minReportingStake = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)
    const reassuranceRate = helper.percentage(50)

    const requiresWhitelist = false
    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate]

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, deployed.dai.address, requiresWhitelist, values)
    await deployed.cover.deployVault(coverKey)

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
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockValidationLibUser',
      { ValidationLibV1: deployed.validationLibV1.address },
      deployed.store.address
    )
  })

  it('revert when not disputed', async () => {
    const coverKey = key.toBytes32('foo-bar')

    await mockContract.mustBeDisputed(coverKey)
      .should.be.rejectedWith('Not disputed')
  })

  it('must correctly check cover status', async () => {
    const coverKey = key.toBytes32('foo-bar')

    const [, bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))
    const attestAmount = helper.ether(1200)
    const disputeAmount = helper.ether(2000)

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, attestAmount)
    await deployed.governance.report(coverKey, reportingInfo, attestAmount)

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, disputeAmount)
    await deployed.governance.connect(bob).dispute(coverKey, incidentDate, disputeInfo, disputeAmount)

    await mockContract.mustBeDisputed(coverKey)

    // Cleanup - resolve, finalize
    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, incidentDate)
  })
})
