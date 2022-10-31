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
  let store, deployed

  beforeEach(async () => {
    deployed = await deployDependencies()
    store = deployed.store
  })

  it('should deploy correctly', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
      npm: deployed.npm.address,
      treasury: helper.randomAddress(),
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
      minStakeToAddLiquidity: helper.ether(0),
      firstReportingStake: helper.ether(250),
      claimPeriod: 7 * DAYS,
      reportingBurnRate: helper.percentage(30),
      governanceReporterCommission: helper.percentage(10),
      claimPlatformFee: helper.percentage(6.5),
      claimReporterCommission: helper.percentage(5),
      flashLoanFee: helper.percentage(0.5),
      flashLoanFeeProtocol: helper.percentage(2.5),
      resolutionCoolDownPeriod: 1 * DAYS,
      stateUpdateInterval: 1 * DAYS,
      maxLendingRatio: helper.percentage(5)
    }

    await protocol.initialize(args)

    protocol.address.should.not.be.empty
    protocol.address.should.not.equal(helper.zerox)
    ; (await protocol.version()).should.equal(key.toBytes32('v0.1'))
    ; (await protocol.getName()).should.equal(key.PROTOCOL.CNAME.PROTOCOL)
  })

  it('should correctly set storage values', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
      npm: deployed.npm.address,
      treasury,
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
      minStakeToAddLiquidity: helper.ether(0),
      firstReportingStake: helper.ether(250),
      claimPeriod: 7 * DAYS,
      reportingBurnRate: helper.percentage(30),
      governanceReporterCommission: helper.percentage(10),
      claimPlatformFee: helper.percentage(6.5),
      claimReporterCommission: helper.percentage(5),
      flashLoanFee: helper.percentage(0.5),
      flashLoanFeeProtocol: helper.percentage(2.5),
      resolutionCoolDownPeriod: 1 * DAYS,
      stateUpdateInterval: 1 * DAYS,
      maxLendingRatio: helper.percentage(5)
    }

    await protocol.initialize(args)

    const sProtocolAddress = await store.getAddress(key.PROTOCOL.CNS.CORE)
    sProtocolAddress.should.equal(protocol.address)

    const isProtocolAddress = await store.getBool(key.qualify(protocol.address))
    isProtocolAddress.should.be.true

    const npmAddress = await store.getAddress(key.PROTOCOL.CNS.NPM)
    npmAddress.should.equal(deployed.npm.address)

    const sBurner = await store.getAddress(key.PROTOCOL.CNS.BURNER)
    sBurner.should.equal(helper.zero1)

    const sTreasury = await store.getAddress(key.PROTOCOL.CNS.TREASURY)
    sTreasury.should.equal(treasury)
  })

  it('should allow initializing more than once', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
      npm: deployed.npm.address,
      treasury: helper.randomAddress(),
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
      minStakeToAddLiquidity: helper.ether(0),
      firstReportingStake: helper.ether(250),
      claimPeriod: 7 * DAYS,
      reportingBurnRate: helper.percentage(30),
      governanceReporterCommission: helper.percentage(10),
      claimPlatformFee: helper.percentage(6.5),
      claimReporterCommission: helper.percentage(5),
      flashLoanFee: helper.percentage(0.5),
      flashLoanFeeProtocol: helper.percentage(2.5),
      resolutionCoolDownPeriod: 1 * DAYS,
      stateUpdateInterval: 1 * DAYS,
      maxLendingRatio: helper.percentage(5)
    }

    await protocol.initialize(args)

    args.npm = helper.zerox

    await protocol.initialize(args)
  })

  it('should fail when zero address is provided as store', async () => {
    await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      helper.zerox
    ).should.be.rejectedWith('Invalid Store')
  })

  it('should fail when zero address is provided as NPM', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
      npm: helper.zerox,
      treasury: helper.randomAddress(),
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
      minStakeToAddLiquidity: helper.ether(0),
      firstReportingStake: helper.ether(250),
      claimPeriod: 7 * DAYS,
      reportingBurnRate: helper.percentage(30),
      governanceReporterCommission: helper.percentage(10),
      claimPlatformFee: helper.percentage(6.5),
      claimReporterCommission: helper.percentage(5),
      flashLoanFee: helper.percentage(0.5),
      flashLoanFeeProtocol: helper.percentage(2.5),
      resolutionCoolDownPeriod: 1 * DAYS,
      stateUpdateInterval: 1 * DAYS,
      maxLendingRatio: helper.percentage(5)
    }

    await protocol.initialize(args).should.be.rejectedWith('Invalid NPM')
  })

  it('should fail when zero address is provided as treasury', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
      npm: deployed.npm.address,
      treasury: helper.zerox,
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
      minStakeToAddLiquidity: helper.ether(0),
      firstReportingStake: helper.ether(250),
      claimPeriod: 7 * DAYS,
      reportingBurnRate: helper.percentage(30),
      governanceReporterCommission: helper.percentage(10),
      claimPlatformFee: helper.percentage(6.5),
      claimReporterCommission: helper.percentage(5),
      flashLoanFee: helper.percentage(0.5),
      flashLoanFeeProtocol: helper.percentage(2.5),
      resolutionCoolDownPeriod: 1 * DAYS,
      stateUpdateInterval: 1 * DAYS,
      maxLendingRatio: helper.percentage(5)
    }

    await protocol.initialize(args).should.be.rejectedWith('Invalid Treasury')
  })

  it('should fail if a non-admin tries to re-initialize the protocol', async () => {
    const [owner] = await ethers.getSigners()

    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
      npm: deployed.npm.address,
      treasury: helper.randomAddress(),
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
      minStakeToAddLiquidity: helper.ether(0),
      firstReportingStake: helper.ether(250),
      claimPeriod: 7 * DAYS,
      reportingBurnRate: helper.percentage(30),
      governanceReporterCommission: helper.percentage(10),
      claimPlatformFee: helper.percentage(6.5),
      claimReporterCommission: helper.percentage(5),
      flashLoanFee: helper.percentage(0.5),
      flashLoanFeeProtocol: helper.percentage(2.5),
      resolutionCoolDownPeriod: 1 * DAYS,
      stateUpdateInterval: 1 * DAYS,
      maxLendingRatio: helper.percentage(5)
    }

    await protocol.initialize(args)

    await protocol.revokeRole(key.ACCESS_CONTROL.ADMIN, owner.address)

    await protocol.initialize(args).should.be.rejectedWith('Forbidden')
  })

  it('should not allow NPM address to be changed', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
      npm: deployed.npm.address,
      treasury: helper.randomAddress(),
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
      minStakeToAddLiquidity: helper.ether(0),
      firstReportingStake: helper.ether(250),
      claimPeriod: 7 * DAYS,
      reportingBurnRate: helper.percentage(30),
      governanceReporterCommission: helper.percentage(10),
      claimPlatformFee: helper.percentage(6.5),
      claimReporterCommission: helper.percentage(5),
      flashLoanFee: helper.percentage(0.5),
      flashLoanFeeProtocol: helper.percentage(2.5),
      resolutionCoolDownPeriod: 1 * DAYS,
      stateUpdateInterval: 1 * DAYS,
      maxLendingRatio: helper.percentage(5)
    }

    await protocol.initialize(args)

    args.npm = helper.randomAddress()

    await protocol.initialize(args).should.be.rejectedWith('Can\'t change NPM')
  })

  it('should fail if zero address is provided as burner', async () => {
    const protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zerox,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
      npm: deployed.npm.address,
      treasury: helper.randomAddress(),
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
      minStakeToAddLiquidity: helper.ether(0),
      firstReportingStake: helper.ether(250),
      claimPeriod: 7 * DAYS,
      reportingBurnRate: helper.percentage(30),
      governanceReporterCommission: helper.percentage(10),
      claimPlatformFee: helper.percentage(6.5),
      claimReporterCommission: helper.percentage(5),
      flashLoanFee: helper.percentage(0.5),
      flashLoanFeeProtocol: helper.percentage(2.5),
      resolutionCoolDownPeriod: 1 * DAYS,
      stateUpdateInterval: 1 * DAYS,
      maxLendingRatio: helper.percentage(5)
    }

    await protocol.initialize(args).should.be.rejectedWith('Invalid Burner')
  })
})
