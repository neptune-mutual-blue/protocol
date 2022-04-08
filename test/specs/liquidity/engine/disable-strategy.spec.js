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

describe('Liquidity Engine: disableStrategy', () => {
  let store,
    aaveStrategy,
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

    const aToken = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(100_000_000))

    const aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)

    aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
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
  })

  it('correctly disables strategy', async () => {
    const tx = await liquidityEngine.disableStrategy(aaveStrategy.address)

    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'StrategyDisabled')

    event.args.strategy.should.equal(aaveStrategy.address)
  })

  it('must throw while disabling an invalid strategy', async () => {
    await liquidityEngine.disableStrategy(helper.randomAddress())
      .should.be.rejectedWith('Invalid strategy')
  })

  it('correctly get disabled strategies', async () => {
    await liquidityEngine.disableStrategy(aaveStrategy.address)
    const disabledStrategies = await liquidityEngine.getDisabledStrategies()

    disabledStrategies.should.deep.equal([aaveStrategy.address])
  })

  it('reverts when not accessed by LiquidityManager', async () => {
    const [, bob] = await ethers.getSigners()
    await liquidityEngine.connect(bob).disableStrategy(aaveStrategy.address).should.be.rejectedWith('Forbidden')
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()

    await liquidityEngine.disableStrategy(aaveStrategy.address).should.be.rejectedWith('Protocol is paused')
  })
})
