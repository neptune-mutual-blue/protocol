/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const composer = require('../../../util/composer')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

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

    deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
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
    await deployed.vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockValidationLibUser',
      { ValidationLibV1: deployed.validationLibV1.address },
      deployed.store.address
    )
  })

  it('revert when not disputed', async () => {
    const coverKey = key.toBytes32('foo-bar')

    await mockContract.mustBeDisputed(coverKey, helper.emptyBytes32)
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
    await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, attestAmount)

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, disputeAmount)
    await deployed.governance.connect(bob).dispute(coverKey, helper.emptyBytes32, incidentDate, disputeInfo, disputeAmount)

    await mockContract.mustBeDisputed(coverKey, helper.emptyBytes32)

    // Cleanup - resolve, finalize
    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })
})

describe('ValidationLibV1: mustHaveNormalProductStatus', () => {
  let deployed, mockContract, coverKey, productKey

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

  const requiresWhitelist = false

  const info = key.toBytes32('info')

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    productKey = key.toBytes32('test')

    deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
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
      productKey,
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
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
    await deployed.vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockValidationLibUser',
      { ValidationLibV1: deployed.validationLibV1.address },
      deployed.store.address
    )
  })

  it('must correctly check cover status', async () => {
    await mockContract.mustHaveNormalProductStatus(coverKey, productKey)
  })

  it('reverts if cover does not exist', async () => {
    const coverKey = key.toBytes32('invalid-cover')
    await mockContract.mustHaveNormalProductStatus(coverKey, productKey).should.be.rejectedWith('Cover does not exist')
  })

  it('reverts if status is not normal', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.npm.transfer(bob.address, helper.ether(2000))
    const attestAmount = helper.ether(1200)
    const disputeAmount = helper.ether(2000)

    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, attestAmount)
    await deployed.governance.report(coverKey, productKey, reportingInfo, attestAmount)

    const incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, productKey)

    const disputeInfo = key.toBytes32('dispute-info')
    await deployed.npm.connect(bob).approve(deployed.governance.address, disputeAmount)
    await deployed.governance.connect(bob).dispute(coverKey, productKey, incidentDate, disputeInfo, disputeAmount)

    await mockContract.mustHaveNormalProductStatus(coverKey, productKey).should.be.rejectedWith('Status not normal')

    // Cleanup - resolve, finalize
    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.resolve(coverKey, productKey, incidentDate)
    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    // Claim period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
    await deployed.resolution.finalize(coverKey, productKey, incidentDate)
  })
})
