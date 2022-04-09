/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Governance Constructor and Views', () => {
  let deployed, registry, governance

  before(async () => {
    deployed = await deployDependencies()

    registry = await deployer.deployWithLibraries(cache, 'MockRegistryClient', {
      RegistryLibV1: deployed.registryLibV1.address
    }, deployed.store.address)
  })

  it('correctly deploys', async () => {
    governance = await deployer.deployWithLibraries(cache, 'Governance', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      CoverUtilV1: deployed.coverUtilV1.address,
      GovernanceUtilV1: deployed.governanceUtilV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.upgradeContract(key.PROTOCOL.CNS.GOVERNANCE, deployed.governance.address, governance.address)

    governance.address.should.not.be.empty
    governance.address.should.not.equal(helper.zerox)
    ; (await governance.version()).should.equal(key.toBytes32('v0.1'))
    ; (await governance.getName()).should.equal(key.PROTOCOL.CNAME.GOVERNANCE)
  })

  it('must correctly return governance contract address from the registry', async () => {
    (await registry.getGovernanceContract()).should.equal(governance.address)
  })
})
