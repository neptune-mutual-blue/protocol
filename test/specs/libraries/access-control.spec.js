/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

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
