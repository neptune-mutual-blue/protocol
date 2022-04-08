/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Liquidity Engine: `setLiquidityStateUpdateInterval` function', () => {
  let store,
    liquidityEngine,
    accessControlLibV1,
    baseLibV1,
    validationLibV1,
    strategyLibV1,
    storeKeyUtil,
    deployed

  before(async () => {
    deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    validationLibV1 = deployed.validationLibV1
    strategyLibV1 = deployed.strategyLibV1
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

  it('correctly sets liquidity state update interval', async () => {
    const value = '10'

    const tx = await liquidityEngine.setLiquidityStateUpdateInterval(value)

    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'LiquidityStateUpdateIntervalSet')

    event.args.duration.should.equal(value)
  })

  it('reverts when protocol is paused', async () => {
    const value = '10'

    await deployed.protocol.pause()
    await liquidityEngine.setLiquidityStateUpdateInterval(value)
      .should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when not accessed by LiquidityManager', async () => {
    const [, bob] = await ethers.getSigners()
    const value = '10'

    await liquidityEngine.connect(bob).setLiquidityStateUpdateInterval(value)
      .should.be.rejectedWith('Forbidden')
  })
})
