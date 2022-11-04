/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const fallback = {
  lendingPeriod: 180 * DAYS,
  withdrawalWindow: 7 * DAYS
}

describe('Liquidity Engine: `setRiskPoolingPeriods` function', () => {
  const coverKey = key.toBytes32('test')
  let store,
    liquidityEngine,
    deployed

  before(async () => {
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
  })

  it('correctly gets the lending period', async () => {
    const result = await liquidityEngine.getRiskPoolingPeriods(coverKey)
    result[0].should.equal(fallback.lendingPeriod)
    result[1].should.equal(fallback.withdrawalWindow)
  })

  it('correctly sets lending period', async () => {
    const lendingPeriod = '10'
    const withdrawalWindow = '10'

    const tx = await liquidityEngine.setRiskPoolingPeriods(coverKey, lendingPeriod, withdrawalWindow)

    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'RiskPoolingPeriodSet')

    event.args.lendingPeriod.should.equal(lendingPeriod)
    event.args.withdrawalWindow.should.equal(withdrawalWindow)

    const result = await liquidityEngine.getRiskPoolingPeriods(coverKey)
    result[0].should.equal(lendingPeriod)
    result[1].should.equal(withdrawalWindow)
  })

  it('reverts when protocol is paused', async () => {
    const lendingPeriod = '10'
    const withdrawalWindow = '10'

    await deployed.protocol.pause()
    await liquidityEngine.setRiskPoolingPeriods(coverKey, lendingPeriod, withdrawalWindow).should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when not accessed by LiquidityManager', async () => {
    const [, bob] = await ethers.getSigners()
    const lendingPeriod = '10'
    const withdrawalWindow = '10'

    await liquidityEngine.connect(bob).setRiskPoolingPeriods(coverKey, lendingPeriod, withdrawalWindow).should.be.rejectedWith('Forbidden')
  })

  it('reverts when zero is specified as lendingPeriod', async () => {
    const lendingPeriod = '0'
    const withdrawalWindow = '10'

    await liquidityEngine.setRiskPoolingPeriods(coverKey, lendingPeriod, withdrawalWindow).should.be.rejectedWith('Please specify lending period')
  })

  it('reverts when zero is specified as withdrawalWindow', async () => {
    const lendingPeriod = '10'
    const withdrawalWindow = '0'

    await liquidityEngine.setRiskPoolingPeriods(coverKey, lendingPeriod, withdrawalWindow).should.be.rejectedWith('Please specify withdrawal window')
  })
})
