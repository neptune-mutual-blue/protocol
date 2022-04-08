/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../../../util')
const { deployDependencies } = require('../deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Aave Strategy Constructor', () => {
  let deployed, aaveLendingPool, aToken

  beforeEach(async () => {
    deployed = await deployDependencies()

    aToken = await deployer.deploy(cache, 'FakeToken', 'aToken', 'aToken', helper.ether(100_000_000))
    aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)
  })

  it('correctly deploys', async () => {
    const aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address, aaveLendingPool.address, aToken.address)

   ; (await aaveStrategy.getKey()).should.equal(ethers.utils.solidityKeccak256(['string', 'string', 'string', 'string'], ['lending', 'strategy', 'aave', 'v2']))
    ; (await aaveStrategy.version()).should.equal(key.toBytes32('v0.1'))
    ; (await aaveStrategy.getName()).should.equal(key.PROTOCOL.CNAME.STRATEGY_AAVE)
  })
})
