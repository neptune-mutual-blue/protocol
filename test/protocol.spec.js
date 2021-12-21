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

  const governanceUtilV1 = await deployer.deployWithLibraries(cache, 'GovernanceUtilV1', {
    StoreKeyUtil: storeKeyUtil.address,
    CoverUtilV1: coverUtilV1.address
  })

  const validationLibV1 = await deployer.deployWithLibraries(cache, 'ValidationLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    CoverUtilV1: coverUtilV1.address,
    GovernanceUtilV1: governanceUtilV1.address
  })

  const baseLibV1 = await deployer.deployWithLibraries(cache, 'BaseLibV1', {
    ValidationLibV1: validationLibV1.address,
    AccessControlLibV1: accessControlLibV1.address
  })

  return { npm, store, router, storeKeyUtil, protoUtilV1, accessControlLibV1, registryLibV1, coverUtilV1, governanceUtilV1, validationLibV1, baseLibV1 }
}

describe('Constructor & Initializer', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
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
      router.address,
      npm.address,
      treasury,
      assuranceVault,
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Burn Rate: 30%
      helper.ether(0.1) // Reporter Commission: 10%
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
      router.address,
      npm.address,
      treasury,
      assuranceVault,
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Burn Rate: 30%
      helper.ether(0.1) // Reporter Commission: 10%
    )

    const sProtocolAddress = await store.getAddress(key.toBytes32(key.NS.CORE))
    sProtocolAddress.should.equal(protocol.address)

    const isProtocolAddress = await store.getBool(key.qualify(protocol.address))
    isProtocolAddress.should.be.true

    const sNEPAddress = await store.getAddress(key.toBytes32(key.NS.SETUP_NEP))
    sNEPAddress.should.equal(npm.address)

    const sBurner = await store.getAddress(key.toBytes32(key.NS.BURNER))
    sBurner.should.equal(helper.zero1)

    const sTreasury = await store.getAddress(key.toBytes32(key.NS.TREASURY))
    sTreasury.should.equal(treasury)

    const sAssuranceVault = await store.getAddress(key.toBytes32(key.NS.ASSURANCE_VAULT))
    sAssuranceVault.should.equal(assuranceVault)
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
    ).should.be.revertedWith('Invalid Store')
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
      router.address,
      helper.zerox,
      treasury,
      assuranceVault,
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Burn Rate: 30%
      helper.ether(0.1) // Reporter Commission: 10%
    ).should.be.revertedWith('Invalid NPM')
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
      router.address,
      npm.address,
      helper.zerox,
      assuranceVault,
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Burn Rate: 30%
      helper.ether(0.1) // Reporter Commission: 10%
    ).should.be.revertedWith('Invalid Treasury')
  })

  it('should fail when zero address is provided as assurance vault', async () => {
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
      router.address,
      npm.address,
      treasury,
      helper.zerox,
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Burn Rate: 30%
      helper.ether(0.1) // Reporter Commission: 10%
    ).should.be.revertedWith('Invalid Vault')
  })
})

describe('Adding a New Protocol Contract', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
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

    await protocol.grantRole(key.toBytes32(key.NS.ROLES.UPGRADE_AGENT), owner.address)

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      router.address,
      npm.address,
      treasury,
      assuranceVault,
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Burn Rate: 30%
      helper.ether(0.1) // Reporter Commission: 10%
    )
  })

  it('should correctly add a new contract', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), fakeCover)
  })

  it('should correctly set storage values', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), fakeCover)

    const sContractAddress = await store.getAddress(key.qualifyBytes32(key.NS.COVER))

    sContractAddress.should.equal(fakeCover)
  })
})

describe('Upgrading Protocol Contract(s)', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
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

    await protocol.grantRole(key.toBytes32(key.NS.ROLES.UPGRADE_AGENT), owner.address)

    await protocol.initialize(
      router.address,
      npm.address,
      treasury,
      assuranceVault,
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Burn Rate: 30%
      helper.ether(0.1) // Reporter Commission: 10%
    )
  })

  it('should correctly upgrade a contract', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), fakeCover)

    const fakeCover2 = helper.randomAddress()
    await protocol.upgradeContract(key.toBytes32(key.NS.COVER), fakeCover, fakeCover2)
  })

  it('should fail when the previous address is incorrect', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), fakeCover)

    const fakeCover2 = helper.randomAddress()
    await protocol.upgradeContract(key.toBytes32(key.NS.COVER), helper.randomAddress(), fakeCover2)
      .should.be.revertedWith('Not a protocol member')
  })

  it('should correctly set storage values', async () => {
    const cover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), cover)

    let storedContractAddress = await store.getAddress(key.qualifyBytes32(key.NS.COVER))

    storedContractAddress.should.equal(cover)

    // ------- UPGRADE CONTRACT -------

    const cover2 = helper.randomAddress()
    await protocol.upgradeContract(key.toBytes32(key.NS.COVER), cover, cover2)

    storedContractAddress = await store.getAddress(key.qualifyBytes32(key.NS.COVER))
    storedContractAddress.should.equal(cover2)
  })
})

describe('Adding a New Protocol Member', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
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

    await protocol.grantRole(key.toBytes32(key.NS.ROLES.UPGRADE_AGENT), owner.address)
    await protocol.grantRole(key.toBytes32(key.NS.ROLES.UPGRADE_AGENT), owner.address)

    await protocol.initialize(
      router.address,
      npm.address,
      treasury,
      assuranceVault,
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Burn Rate: 30%
      helper.ether(0.1) // Reporter Commission: 10%
    )
  })

  it('should correctly add a new member', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)
  })

  it('should reject adding the same member twice', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)
    await protocol.addMember(fakeMember).should.be.revertedWith('Already exists')
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
  const assuranceVault = helper.randomAddress()
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

    await protocol.grantRole(key.toBytes32(key.NS.ROLES.UPGRADE_AGENT), owner.address)

    await protocol.initialize(
      router.address,
      npm.address,
      treasury,
      assuranceVault,
      helper.ether(0), // Cover Fee
      helper.ether(0), // Min Cover Stake
      helper.ether(250), // Min Reporting Stake
      7 * DAYS, // Min liquidity period
      7 * DAYS, // Claim period
      helper.ether(0.3), // Burn Rate: 30%
      helper.ether(0.1) // Reporter Commission: 10%
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
