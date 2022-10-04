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

describe('Liquidity Engine: deleteStrategy', () => {
  let store,
    aaveStrategy,
    deployed,
    liquidityEngine

  beforeEach(async () => {
    deployed = await deployDependencies()
    store = deployed.store

    liquidityEngine = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.LIQUIDITY_ENGINE, liquidityEngine.address)

    const aToken = await deployer.deploy(cache, 'FakeToken', 'aToken', 'aToken', helper.ether(100_000_000), 18)

    const aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)

    aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, store.address, aaveLendingPool.address, aToken.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_AAVE, aaveStrategy.address)

    await liquidityEngine.addStrategies([aaveStrategy.address])
  })

  it('correctly deletes strategy', async () => {
    await liquidityEngine.disableStrategy(aaveStrategy.address)
    const tx = await liquidityEngine.deleteStrategy(aaveStrategy.address)

    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'StrategyDeleted')

    event.args.strategy.should.equal(aaveStrategy.address)
  })

  it('must throw when tried to delete before disabling strategy', async () => {
    await liquidityEngine.deleteStrategy(aaveStrategy.address)
      .should.be.rejectedWith('Invalid strategy')
  })

  it('must throw while deleting an invalid strategy', async () => {
    await liquidityEngine.deleteStrategy(helper.randomAddress())
      .should.be.rejectedWith('Invalid strategy')
  })

  // it('correctly get deleted strategies', async () => {
  //   await liquidityEngine.deleteStrategy(aaveStrategy.address)
  //   const deletedStrategies = await liquidityEngine.getDeletedStrategies()

  //   deletedStrategies.should.deep.equal([aaveStrategy.address])
  // })

  it('reverts when not accessed by LiquidityManager', async () => {
    const [, bob] = await ethers.getSigners()
    await liquidityEngine.connect(bob).deleteStrategy(aaveStrategy.address).should.be.rejectedWith('Forbidden')
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()

    await liquidityEngine.deleteStrategy(aaveStrategy.address).should.be.rejectedWith('Protocol is paused')
  })
})
