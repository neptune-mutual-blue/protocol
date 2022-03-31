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
  let store,
    accessControlLibV1,
    baseLibV1,
    coverUtilV1,
    governanceUtilV1,
    transferLib,
    protoUtilV1,
    registryLibV1,
    storeKeyUtil,
    validationLibV1

  before(async () => {
    const deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    coverUtilV1 = deployed.coverUtilV1
    governanceUtilV1 = deployed.governanceUtilV1
    transferLib = deployed.transferLib
    protoUtilV1 = deployed.protoUtilV1
    registryLibV1 = deployed.registryLibV1
    storeKeyUtil = deployed.storeKeyUtil
    validationLibV1 = deployed.validationLibV1
  })

  it('correctly deploys', async () => {
    const governance = await deployer.deployWithLibraries(cache, 'Governance', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      CoverUtilV1: coverUtilV1.address,
      GovernanceUtilV1: governanceUtilV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    governance.address.should.not.be.empty
    governance.address.should.not.equal(helper.zerox)
    ; (await governance.version()).should.equal(key.toBytes32('v0.1'))
    ; (await governance.getName()).should.equal(key.PROTOCOL.CNAME.GOVERNANCE)
  })
})
