/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../../../util')
const { deployDependencies } = require('../deps')
const cache = null
const CNAME_STRATEGY_COMPOUND = key.toBytes32('Compound Strategy')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Compound Strategy Constructor', () => {
  let deployed, daiDelegator, cDai

  beforeEach(async () => {
    deployed = await deployDependencies()

    cDai = await deployer.deploy(cache, 'FakeToken', 'cDai', 'cDai', helper.ether(100_000_000), 18)
    daiDelegator = await deployer.deploy(cache, 'FakeCompoundDaiDelegator', deployed.dai.address, cDai.address)
  })

  it('correctly deploys', async () => {
    const compoundStrategy = await deployer.deployWithLibraries(cache, 'CompoundStrategy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address, daiDelegator.address, cDai.address)

   ; (await compoundStrategy.getKey()).should.equal(ethers.utils.solidityKeccak256(['string', 'string', 'string', 'string'], ['lending', 'strategy', 'compound', 'v2']))
    ; (await compoundStrategy.version()).should.equal(key.toBytes32('v0.1'))
    ; (await compoundStrategy.getName()).should.equal(CNAME_STRATEGY_COMPOUND)
  })
})
