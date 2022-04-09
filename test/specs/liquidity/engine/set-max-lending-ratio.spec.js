/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Liquidity Engine: `setMaxLendingRatio` function', () => {
  let store,
    liquidityEngine,
    accessControlLibV1,
    baseLibV1,
    validationLibV1,
    storeKeyUtil,
    strategyLibV1,
    deployed

  before(async () => {
    deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    validationLibV1 = deployed.validationLibV1
    storeKeyUtil = deployed.storeKeyUtil
    strategyLibV1 = deployed.strategyLibV1

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
    const ratio = helper.percentage(5)

    const tx = await liquidityEngine.setMaxLendingRatio(ratio)

    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'MaxLendingRatioSet')

    event.args.ratio.should.equal(ratio)

    const result = await liquidityEngine.getMaxLendingRatio()
    result.should.equal(ratio)
  })

  it('reverts when zero is set as the max lending ratio', async () => {
    const ratio = helper.percentage(0)

    await liquidityEngine.setMaxLendingRatio(ratio)
      .should.be.rejectedWith('Please specify lending ratio')
  })

  it('reverts when more than 100% is specified as the max lending ratio', async () => {
    const ratio = helper.percentage(100.1)

    await liquidityEngine.setMaxLendingRatio(ratio)
      .should.be.rejectedWith('Invalid lending ratio')
  })

  it('reverts when protocol is paused', async () => {
    const ratio = helper.percentage(5)

    await deployed.protocol.pause()
    await liquidityEngine.setMaxLendingRatio(ratio).should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when not accessed by LiquidityManager', async () => {
    const [, bob] = await ethers.getSigners()
    const ratio = helper.percentage(5)

    await liquidityEngine.connect(bob).setMaxLendingRatio(ratio).should.be.rejectedWith('Forbidden')
  })
})
