/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
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

describe('AccessControlLibV1: callerMustBeAdmin', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockAccessControlUser',
      { AccessControlLibV1: deployed.accessControlLibV1.address },
      deployed.store.address
    )
  })

  it('must validate caller', async () => {
    const [owner] = await ethers.getSigners()
    await mockContract.callerMustBeAdmin(owner.address)
  })

  it('revert when not accessed by Admin', async () => {
    const [, bob] = await ethers.getSigners()
    await mockContract.callerMustBeAdmin(bob.address)
      .should.be.rejectedWith('Forbidden')
  })
})

describe('AccessControlLibV1: callerMustBeCoverManager', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockAccessControlUser',
      { AccessControlLibV1: deployed.accessControlLibV1.address },
      deployed.store.address
    )
  })

  it('must validate caller', async () => {
    const [owner] = await ethers.getSigners()
    await mockContract.callerMustBeCoverManager(owner.address)
  })

  it('revert when not accessed by CoverManager', async () => {
    const [, bob] = await ethers.getSigners()
    await mockContract.callerMustBeCoverManager(bob.address)
      .should.be.rejectedWith('Forbidden')
  })
})

describe('AccessControlLibV1: callerMustBeGovernanceAgent', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockAccessControlUser',
      { AccessControlLibV1: deployed.accessControlLibV1.address },
      deployed.store.address
    )
  })

  it('must validate caller', async () => {
    const [owner] = await ethers.getSigners()
    await mockContract.callerMustBeGovernanceAgent(owner.address)
  })

  it('revert when not accessed by GovernanceAgent', async () => {
    const [, bob] = await ethers.getSigners()
    await mockContract.callerMustBeGovernanceAgent(bob.address)
      .should.be.rejectedWith('Forbidden')
  })
})

describe('AccessControlLibV1: callerMustBeGovernanceAdmin', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockAccessControlUser',
      { AccessControlLibV1: deployed.accessControlLibV1.address },
      deployed.store.address
    )
  })

  it('must validate caller', async () => {
    const [owner] = await ethers.getSigners()
    await mockContract.callerMustBeGovernanceAdmin(owner.address)
  })

  it('revert when not accessed by GovernanceAdmin', async () => {
    const [, bob] = await ethers.getSigners()
    await mockContract.callerMustBeGovernanceAdmin(bob.address)
      .should.be.rejectedWith('Forbidden')
  })
})

describe('AccessControlLibV1: callerMustBeRecoveryAgent', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockAccessControlUser',
      { AccessControlLibV1: deployed.accessControlLibV1.address },
      deployed.store.address
    )
  })

  it('must validate caller', async () => {
    const [owner] = await ethers.getSigners()
    await mockContract.callerMustBeRecoveryAgent(owner.address)
  })

  it('revert when not accessed by RecoveryAgent', async () => {
    const [, bob] = await ethers.getSigners()
    await mockContract.callerMustBeRecoveryAgent(bob.address)
      .should.be.rejectedWith('Forbidden')
  })
})

describe('AccessControlLibV1: callerMustBePauseAgent', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockAccessControlUser',
      { AccessControlLibV1: deployed.accessControlLibV1.address },
      deployed.store.address
    )
  })

  it('must validate caller', async () => {
    const [owner] = await ethers.getSigners()
    await mockContract.callerMustBePauseAgent(owner.address)
  })

  it('revert when not accessed by PauseAgent', async () => {
    const [, bob] = await ethers.getSigners()
    await mockContract.callerMustBePauseAgent(bob.address)
      .should.be.rejectedWith('Forbidden')
  })
})

describe('AccessControlLibV1: callerMustBeUnpauseAgent', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockAccessControlUser',
      { AccessControlLibV1: deployed.accessControlLibV1.address },
      deployed.store.address
    )
  })

  it('must validate caller', async () => {
    const [owner] = await ethers.getSigners()
    await mockContract.callerMustBeUnpauseAgent(owner.address)
  })

  it('revert when not accessed by UnpauseAgent', async () => {
    const [, bob] = await ethers.getSigners()
    await mockContract.callerMustBeUnpauseAgent(bob.address)
      .should.be.rejectedWith('Forbidden')
  })
})

describe('AccessControlLibV1: hasAccess', () => {
  let deployed, mockContract, mockStoreUser

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockAccessControlUser',
      { AccessControlLibV1: deployed.accessControlLibV1.address },
      deployed.store.address
    )

    mockStoreUser = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockStoreUser.address), true)
  })

  it('must return false when protocol address is zero', async () => {
    const [owner] = await ethers.getSigners()
    const protocolAddress = await mockStoreUser.getAddressByKey(key.PROTOCOL.CNS.CORE)
    await mockStoreUser.setAddressByKey(key.PROTOCOL.CNS.CORE, helper.zerox)

    const result = await mockContract.hasAccess(key.ACCESS_CONTROL.GOVERNANCE_AGENT, owner.address)
    result.should.equal(false)

    await mockStoreUser.setAddressByKey(key.PROTOCOL.CNS.CORE, protocolAddress)
  })

  it('must validate caller', async () => {
    const [owner] = await ethers.getSigners()
    const result = await mockContract.hasAccess(key.ACCESS_CONTROL.GOVERNANCE_AGENT, owner.address)
    result.should.equal(true)
  })
})

describe('AccessControlLibV1: _deleteContract', () => {
  let deployed, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
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
  })

  it('must delete previous contract address and add new one during update', async () => {
    await deployed.protocol.upgradeContractWithKey(key.PROTOCOL.CNS.COVER_VAULT, coverKey, deployed.vault.address, deployed.vault.address)
  })
})
