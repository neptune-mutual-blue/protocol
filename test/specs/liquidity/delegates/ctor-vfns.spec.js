/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('VaultDelegate Constructor and Views', () => {
  let deployed, store,
    accessControlLibV1,
    baseLibV1,
    protoUtilV1,
    validationLibV1,
    vaultLib,
    strategyLibV1,
    storeKeyUtil,
    routineInvokerLibV1

  before(async () => {
    deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    protoUtilV1 = deployed.protoUtilV1
    validationLibV1 = deployed.validationLibV1
    vaultLib = deployed.vaultLib
    strategyLibV1 = deployed.strategyLibV1
    storeKeyUtil = deployed.storeKeyUtil
    routineInvokerLibV1 = deployed.routineInvokerLibV1
  })

  it('correctly deploys', async () => {
    const vaultDelegate = await deployer.deployWithLibraries(cache, 'VaultDelegate',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RoutineInvokerLibV1: routineInvokerLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        StrategyLibV1: strategyLibV1.address,
        ValidationLibV1: validationLibV1.address,
        VaultLibV1: vaultLib.address
      }
      , store.address
    )

    const _store = await vaultDelegate.s()
    _store.should.equal(store.address)

    const version = await vaultDelegate.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await vaultDelegate.getName()
    name.should.equal(key.PROTOCOL.CNAME.VAULT_DELEGATE)
  })
})
