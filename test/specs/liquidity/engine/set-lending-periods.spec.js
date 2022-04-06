/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Liquidity Engine: `setLendingPeriods` function', () => {
  const coverkey = key.toBytes32('test')
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

  it('correctly sets lending period', async () => {
    const lendingPeriod = '10'
    const withdrawalWindow = '10'

    const tx = await liquidityEngine.setLendingPeriods(coverkey, lendingPeriod, withdrawalWindow)

    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'LendingPeriodSet')

    event.args.lendingPeriod.should.equal(lendingPeriod)
    event.args.withdrawalWindow.should.equal(withdrawalWindow)
  })

  it('reverts when protocol is paused', async () => {
    const lendingPeriod = '10'
    const withdrawalWindow = '10'

    await deployed.protocol.pause()
    await liquidityEngine.setLendingPeriods(coverkey, lendingPeriod, withdrawalWindow).should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when not accessed by LiquidityManager', async () => {
    const [, bob] = await ethers.getSigners()
    const lendingPeriod = '10'
    const withdrawalWindow = '10'

    await liquidityEngine.connect(bob).setLendingPeriods(coverkey, lendingPeriod, withdrawalWindow).should.be.rejectedWith('Forbidden')
  })

  it('reverts when zero is specified as lendingPeriod', async () => {
    const lendingPeriod = '0'
    const withdrawalWindow = '10'

    await liquidityEngine.setLendingPeriods(coverkey, lendingPeriod, withdrawalWindow).should.be.rejectedWith('Please specify lending period')
  })

  it('reverts when zero is specified as withdrawalWindow', async () => {
    const lendingPeriod = '10'
    const withdrawalWindow = '0'

    await liquidityEngine.setLendingPeriods(coverkey, lendingPeriod, withdrawalWindow).should.be.rejectedWith('Please specify withdrawal window')
  })
})
