/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Policy Admin Constructor and Views', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly deploys', async () => {
    const policyAdminContract = await deployer.deployWithLibraries(cache, 'PolicyAdmin', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      PolicyHelperV1: deployed.policyHelperV1.address,
      RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    const version = await policyAdminContract.version()
    const name = await policyAdminContract.getName()

    version.should.equal(key.toBytes32('v0.1'))
    name.should.equal(key.PROTOCOL.CNAME.POLICY_ADMIN)
  })
})
