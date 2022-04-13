/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

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
