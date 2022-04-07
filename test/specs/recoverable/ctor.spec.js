/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Recoverable: Constructor', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('must correctly construct', async () => {
    const recoverable = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    const store = await recoverable.s()
    store.should.equal(deployed.store.address)
  })

  it('must revert if zero value is specified as store', async () => {
    await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, helper.zerox)
      .should.be.rejectedWith('Invalid Store')
  })
})
