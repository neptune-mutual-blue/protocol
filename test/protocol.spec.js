/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../util')
const DAYS = 86400
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const deployDependencies = async () => {
  const store = await deployer.deploy(cache, 'Store')
  const router = await deployer.deploy(cache, 'FakeUniswapV2RouterLike')

  const npm = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(10000))

  const storeKeyUtil = await deployer.deploy(cache, 'StoreKeyUtil')

  const protoUtilV1 = await deployer.deployWithLibraries(cache, 'ProtoUtilV1', {
    StoreKeyUtil: storeKeyUtil.address
  })

  const accessControlLibV1 = await deployer.deployWithLibraries(cache, 'AccessControlLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const registryLibV1 = await deployer.deployWithLibraries(cache, 'RegistryLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const coverUtilV1 = await deployer.deployWithLibraries(cache, 'CoverUtilV1', {
    RegistryLibV1: registryLibV1.address,
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const strategyLibV1 = await deployer.deployWithLibraries(cache, 'StrategyLibV1', {
    StoreKeyUtil: storeKeyUtil.address
  })

  const RoutineInvokerLibV1 = await deployer.deployWithLibraries(cache, 'RoutineInvokerLibV1', {
    CoverUtilV1: coverUtilV1.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StrategyLibV1: strategyLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const governanceUtilV1 = await deployer.deployWithLibraries(cache, 'GovernanceUtilV1', {
    CoverUtilV1: coverUtilV1.address,
    RoutineInvokerLibV1: RoutineInvokerLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const validationLibV1 = await deployer.deployWithLibraries(cache, 'ValidationLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    CoverUtilV1: coverUtilV1.address,
    GovernanceUtilV1: governanceUtilV1.address,
    RegistryLibV1: registryLibV1.address
  })

  const baseLibV1 = await deployer.deployWithLibraries(cache, 'BaseLibV1', {
  })

  return { npm, store, router, storeKeyUtil, protoUtilV1, accessControlLibV1, registryLibV1, coverUtilV1, governanceUtilV1, validationLibV1, baseLibV1 }
}

describe('Constructor & Initializer', () => {
  const treasury = helper.randomAddress()
  const reassuranceVault = helper.randomAddress()
  let npm, store, router, storeKeyUtil, protoUtilV1, accessControlLibV1, validationLibV1, baseLibV1

  beforeEach(async () => {
    const deployed = await deployDependencies()

    npm = deployed.npm
    store = deployed.store
    router = deployed.router
    storeKeyUtil = deployed.storeKeyUtil
    protoUtilV1 = deployed.protoUtilV1
    accessControlLibV1 = deployed.accessControlLibV1
    validationLibV1 = deployed.validationLibV1
    baseLibV1 = deployed.baseLibV1
  })

  it('should deploy correctly', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Min liquidity period
        7 * DAYS, // Claim period
        helper.percentage(30), // Governance Burn Rate: 30%
        helper.percentage(10), // Governance Reporter Commission: 10%
        helper.percentage(6.5), // Claim: Platform Fee: 6.5%
        helper.percentage(5), // Claim: Reporter Commission: 5%
        helper.percentage(0.5), // Flash Loan Fee: 0.5%
        helper.percentage(2.5) // Flash Loan Protocol Fee: 2.5%
      ]
    )

    protocol.address.should.not.be.empty
    protocol.address.should.not.equal(helper.zerox)
  })

  it('should correctly set storage values', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Min liquidity period
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025) // Flash Loan Protocol Fee: 2.5%
      ]
    )

    const sProtocolAddress = await store.getAddress(key.PROTOCOL.CNS.CORE)
    sProtocolAddress.should.equal(protocol.address)

    const isProtocolAddress = await store.getBool(key.qualify(protocol.address))
    isProtocolAddress.should.be.true

    const npmAddress = await store.getAddress(key.PROTOCOL.CNS.NPM)
    npmAddress.should.equal(npm.address)

    const sBurner = await store.getAddress(key.PROTOCOL.CNS.BURNER)
    sBurner.should.equal(helper.zero1)

    const sTreasury = await store.getAddress(key.PROTOCOL.CNS.TREASURY)
    sTreasury.should.equal(treasury)

    const sReassuranceVault = await store.getAddress(key.PROTOCOL.CNS.REASSURANCE_VAULT)
    sReassuranceVault.should.equal(reassuranceVault)
  })

  it('should fail when zero address is provided as store', async () => {
    await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      helper.zerox
    ).should.be.rejectedWith('Invalid Store')
  })

  it('should fail when zero address is provided as NPM', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        helper.zerox,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Min liquidity period
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025) // Flash Loan Protocol Fee: 2.5%
      ]
    ).should.be.rejectedWith('Invalid NPM')
  })

  it('should fail when zero address is provided as treasury', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        helper.zerox,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Min liquidity period
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025) // Flash Loan Protocol Fee: 2.5%
      ]
    ).should.be.rejectedWith('Invalid Treasury')
  })

  it('should fail when zero address is provided as reassurance vault', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        helper.zerox],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Min liquidity period
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025) // Flash Loan Protocol Fee: 2.5%
      ]
    ).should.be.rejectedWith('Invalid Vault')
  })
})

describe('Adding a New Protocol Contract', () => {
  const treasury = helper.randomAddress()
  const reassuranceVault = helper.randomAddress()
  let npm, store, router, protocol

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    const deployed = await deployDependencies()
    const { storeKeyUtil, protoUtilV1, accessControlLibV1, validationLibV1, baseLibV1 } = deployed
    npm = deployed.npm
    store = deployed.store
    router = deployed.router

    protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      store.address
    )

    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Min liquidity period
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025) // Flash Loan Protocol Fee: 2.5%
      ]
    )
  })

  it('should correctly add a new contract', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, fakeCover)
  })

  it('should correctly set storage values', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, fakeCover)

    const storedAddress = await store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER))

    storedAddress.should.equal(fakeCover)
  })
})

describe('Upgrading Protocol Contract(s)', () => {
  const treasury = helper.randomAddress()
  const reassuranceVault = helper.randomAddress()
  let npm, store, router, protocol

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    const deployed = await deployDependencies()
    const { storeKeyUtil, protoUtilV1, accessControlLibV1, validationLibV1, baseLibV1 } = deployed
    npm = deployed.npm
    store = deployed.store
    router = deployed.router

    protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Min liquidity period
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025) // Flash Loan Protocol Fee: 2.5%
      ]
    )
  })

  it('should correctly upgrade a contract', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, fakeCover)

    const fakeCover2 = helper.randomAddress()
    await protocol.upgradeContract(key.PROTOCOL.CNS.COVER, fakeCover, fakeCover2)
  })

  it('should fail when the previous address is incorrect', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, fakeCover)

    const fakeCover2 = helper.randomAddress()
    await protocol.upgradeContract(key.PROTOCOL.CNS.COVER, helper.randomAddress(), fakeCover2)
      .should.be.rejectedWith('Not a protocol member')
  })

  it('should correctly set storage values', async () => {
    const cover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, cover)

    let storedContractAddress = await store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER))

    storedContractAddress.should.equal(cover)

    // ------- UPGRADE CONTRACT -------

    const cover2 = helper.randomAddress()
    await protocol.upgradeContract(key.PROTOCOL.CNS.COVER, cover, cover2)

    storedContractAddress = await store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER))
    storedContractAddress.should.equal(cover2)
  })
})

describe('Adding a New Protocol Member', () => {
  const treasury = helper.randomAddress()
  const reassuranceVault = helper.randomAddress()
  let npm, store, router, protocol

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    const deployed = await deployDependencies()
    const { storeKeyUtil, protoUtilV1, accessControlLibV1, validationLibV1, baseLibV1 } = deployed
    npm = deployed.npm
    store = deployed.store
    router = deployed.router

    protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)
    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Min liquidity period
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025) // Flash Loan Protocol Fee: 2.5%
      ]
    )
  })

  it('should correctly add a new member', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)
  })

  it('should reject adding the same member twice', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)
    await protocol.addMember(fakeMember).should.be.rejectedWith('Already exists')
  })

  it('should correctly set storage values', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)

    const isMember = await store.getBool(key.qualifyMember(fakeMember))
    isMember.should.be.true
  })
})

describe('Removing Protocol Member(s)', () => {
  const treasury = helper.randomAddress()
  const reassuranceVault = helper.randomAddress()
  let npm, store, router, protocol

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    const deployed = await deployDependencies()
    const { storeKeyUtil, protoUtilV1, accessControlLibV1, validationLibV1, baseLibV1 } = deployed
    npm = deployed.npm
    store = deployed.store
    router = deployed.router

    protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        AccessControlLibV1: accessControlLibV1.address,
        ValidationLibV1: validationLibV1.address,
        BaseLibV1: baseLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Min liquidity period
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025) // Flash Loan Protocol Fee: 2.5%
      ]
    )
  })

  it('should correctly remove a member', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)
    await protocol.removeMember(fakeMember)
  })

  it('should correctly set storage values', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)

    let isMember = await store.getBool(key.qualifyMember(fakeMember))
    isMember.should.be.true

    await protocol.removeMember(fakeMember)

    isMember = await store.getBool(key.qualifyMember(fakeMember))
    isMember.should.be.false
  })
})
