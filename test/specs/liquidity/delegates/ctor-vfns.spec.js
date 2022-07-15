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
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly deploys', async () => {
    const vaultDelegate = await deployer.deployWithLibraries(cache, 'VaultDelegate',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        GovernanceUtilV1: deployed.governanceUtilV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        StrategyLibV1: deployed.strategyLibV1.address,
        ValidationLibV1: deployed.validationLibV1.address,
        VaultLibV1: deployed.vaultLib.address
      }
      , deployed.store.address
    )

    const _store = await vaultDelegate.s()
    _store.should.equal(deployed.store.address)

    const version = await vaultDelegate.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await vaultDelegate.getName()
    name.should.equal(key.PROTOCOL.CNAME.VAULT_DELEGATE)
  })
})
