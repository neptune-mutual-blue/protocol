/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Bond Pool Constructor and Views', () => {
  let deployed, registry, bondPool

  before(async () => {
    deployed = await deployDependencies()

    registry = await deployer.deployWithLibraries(cache, 'MockRegistryClient', {
      RegistryLibV1: deployed.registryLibV1.address
    }, deployed.store.address)
  })

  it('correctly deploys', async () => {
    bondPool = await deployer.deployWithLibraries(cache, 'BondPool', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BondPoolLibV1: deployed.bondPoolLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      PriceLibV1: deployed.priceLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.BOND_POOL, bondPool.address)

    bondPool.address.should.not.be.empty
    bondPool.address.should.not.equal(helper.zerox)
    ; (await bondPool.version()).should.equal(key.toBytes32('v0.1'))
    ; (await bondPool.getName()).should.equal(key.PROTOCOL.CNAME.BOND_POOL)
  })

  it('must correctly return bond pool contract address from the registry', async () => {
    (await registry.getBondPoolContract()).should.equal(bondPool.address)
  })
})
