/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Liquidity Engine Constructor and Views', () => {
  let store,
    accessControlLibV1,
    baseLibV1,
    validationLibV1,
    strategyLibV1,
    storeKeyUtil

  beforeEach(async () => {
    const deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    validationLibV1 = deployed.validationLibV1
    strategyLibV1 = deployed.strategyLibV1
    storeKeyUtil = deployed.storeKeyUtil
  })

  it('correctly deploys', async () => {
    const liquidityEngine = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      StrategyLibV1: strategyLibV1.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    const _store = await liquidityEngine.s()

    _store.should.equal(store.address)

    const version = await liquidityEngine.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await liquidityEngine.getName()
    name.should.equal(key.PROTOCOL.CNAME.LIQUIDITY_ENGINE)
  })
})
