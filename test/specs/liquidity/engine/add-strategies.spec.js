/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { deployer, helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Liquidity Engine: addStrategies', () => {
  let store,
    liquidityEngine,
    accessControlLibV1,
    baseLibV1,
    validationLibV1,
    strategyLibV1,
    transferLib,
    protoUtilV1,
    registryLibV1,
    storeKeyUtil,
    deployed

  beforeEach(async () => {
    deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    validationLibV1 = deployed.validationLibV1
    strategyLibV1 = deployed.strategyLibV1
    transferLib = deployed.transferLib
    protoUtilV1 = deployed.protoUtilV1
    registryLibV1 = deployed.registryLibV1
    storeKeyUtil = deployed.storeKeyUtil

    liquidityEngine = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      StrategyLibV1: strategyLibV1.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.LIQUIDITY_ENGINE, liquidityEngine.address)
  })

  it('correctly adds strategies', async () => {
    const aToken = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(100_000_000))

    const aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)

    const aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }, store.address, aaveLendingPool.address, aToken.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_AAVE, aaveStrategy.address)

    const tx = await liquidityEngine.addStrategies([aaveStrategy.address])

    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'StrategyAdded')

    event.args.strategy.should.equal(aaveStrategy.address)
  })

  it('correctly get active strategies', async () => {
    const aToken = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(100_000_000))

    const aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)

    const aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }, store.address, aaveLendingPool.address, aToken.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_AAVE, aaveStrategy.address)

    await liquidityEngine.addStrategies([aaveStrategy.address])

    const activeStrategies = await liquidityEngine.getActiveStrategies()

    activeStrategies.should.deep.equal([aaveStrategy.address])
  })

  it('reverts when not accessed by LiquidityManager', async () => {
    const [, bob] = await ethers.getSigners()
    const aToken = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(100_000_000))

    const aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)

    const aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }, store.address, aaveLendingPool.address, aToken.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_AAVE, aaveStrategy.address)

    await liquidityEngine.connect(bob).addStrategies([aaveStrategy.address]).should.be.rejectedWith('Forbidden')
  })

  it('reverts when too much weight is specified', async () => {
    const aToken = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(100_000_000))

    const aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)

    const invalidStrategy = await deployer.deployWithLibraries(cache, 'InvalidStrategy', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }, store.address, aaveLendingPool.address, aToken.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_AAVE, invalidStrategy.address)
    await liquidityEngine.addStrategies([invalidStrategy.address]).should.be.rejectedWith('Weight too much')
  })

  it('reverts when protocol is paused', async () => {
    const aToken = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(100_000_000))

    const aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)

    const aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }, store.address, aaveLendingPool.address, aToken.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_AAVE, aaveStrategy.address)
    await deployed.protocol.pause()

    await liquidityEngine.addStrategies([aaveStrategy.address]).should.be.rejectedWith('Protocol is paused')
  })
})
