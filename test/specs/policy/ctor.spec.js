/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Policy Constructor', () => {
  let deployed, registry, policy

  before(async () => {
    deployed = await deployDependencies()

    registry = await deployer.deployWithLibraries(cache, 'MockRegistryClient', {
      RegistryLibV1: deployed.registryLibV1.address
    }, deployed.store.address)
  })

  it('correctly deploys', async () => {
    policy = await deployer.deployWithLibraries(cache, 'Policy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      CoverUtilV1: deployed.coverUtilV1.address,
      PolicyHelperV1: deployed.policyHelperV1.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY, policy.address)

    const version = await policy.version()
    const name = await policy.getName()

    version.should.equal(key.toBytes32('v0.1'))
    name.should.equal(key.PROTOCOL.CNAME.POLICY)
  })

  it('must correctly return policy contract address from the registry', async () => {
    (await registry.getPolicyContract()).should.equal(policy.address)
  })
})
