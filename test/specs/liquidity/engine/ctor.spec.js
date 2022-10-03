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
  let store, deployed

  beforeEach(async () => {
    deployed = await deployDependencies()
    store = deployed.store
  })

  it('correctly deploys', async () => {
    const liquidityEngine = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, store.address)

    const _store = await liquidityEngine.s()

    _store.should.equal(store.address)

    const version = await liquidityEngine.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await liquidityEngine.getName()
    name.should.equal(key.PROTOCOL.CNAME.LIQUIDITY_ENGINE)
  })
})
