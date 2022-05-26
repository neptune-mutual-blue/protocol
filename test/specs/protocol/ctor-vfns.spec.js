/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Protocol Constructor & Initializer', () => {
  const treasury = helper.randomAddress()
  const reassuranceVault = helper.randomAddress()
  let npm, store, router, storeKeyUtil, protoUtilV1, accessControlLibV1, validationLibV1, baseLibV1, registryLibV1

  before(async () => {
    const deployed = await deployDependencies()

    npm = deployed.npm
    store = deployed.store
    router = deployed.router
    storeKeyUtil = deployed.storeKeyUtil
    protoUtilV1 = deployed.protoUtilV1
    accessControlLibV1 = deployed.accessControlLibV1
    validationLibV1 = deployed.validationLibV1
    baseLibV1 = deployed.baseLibV1
    registryLibV1 = deployed.registryLibV1
  })

  it('should deploy correctly', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
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
        7 * DAYS, // Claim period
        helper.percentage(30), // Governance Burn Rate: 30%
        helper.percentage(10), // Governance Reporter Commission: 10%
        helper.percentage(6.5), // Claim: Platform Fee: 6.5%
        helper.percentage(5), // Claim: Reporter Commission: 5%
        helper.percentage(0.5), // Flash Loan Fee: 0.5%
        helper.percentage(2.5), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    )

    protocol.address.should.not.be.empty
    protocol.address.should.not.equal(helper.zerox)
    ; (await protocol.version()).should.equal(key.toBytes32('v0.1'))
    ; (await protocol.getName()).should.equal(key.PROTOCOL.CNAME.PROTOCOL)
  })

  it('should correctly set storage values', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [
        helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
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
  })

  it('should allow initializing more than once', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [
        helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    )

    await protocol.initialize(
      [
        helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        helper.zerox, // Can't change NPM address
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    )
  })

  it('should fail when zero address is provided as store', async () => {
    await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
      },
      helper.zerox
    ).should.be.rejectedWith('Invalid Store')
  })

  it('should fail when zero address is provided as NPM', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
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
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    ).should.be.rejectedWith('Invalid NPM')
  })

  it('should fail when zero address is provided as treasury', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
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
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    ).should.be.rejectedWith('Invalid Treasury')
  })

  it('should fail if a non-admin tries to re-initialize the protocol', async () => {
    const [owner] = await ethers.getSigners()

    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [
        helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    )

    await protocol.revokeRole(key.ACCESS_CONTROL.ADMIN, owner.address)

    await protocol.initialize(
      [
        helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    ).should.be.rejectedWith('Forbidden')
  })

  it('should not allow NPM address to be changed', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [
        helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    )

    await protocol.initialize(
      [
        helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    ).should.be.rejectedWith('Can\'t change NPM')
  })

  it('should fail if zero address is provided as burner', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [helper.zerox,
        router.address,
        helper.randomAddress(), // factory
        helper.randomAddress(),
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    ).should.be.rejectedWith('Invalid Burner')
  })

  it('should fail if zero address is provided as uniswap router', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [
        helper.randomAddress(),
        helper.zerox,
        helper.randomAddress(), // factory
        helper.randomAddress(),
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    ).should.be.rejectedWith('Invalid Uniswap V2 Router')
  })

  it('should fail if zero address is provided as uniswap factory', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(
      [
        helper.randomAddress(),
        router.address,
        helper.zerox, // factory
        helper.randomAddress(),
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    ).should.be.rejectedWith('Invalid Uniswap V2 Factory')
  })
})
