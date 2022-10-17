/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../../util')
const { deployDependencies } = require('./deps')
const PRECISION = helper.STABLECOIN_DECIMALS
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault Constructor and Views', () => {
  let store, deployed

  beforeEach(async () => {
    deployed = await deployDependencies()

    store = deployed.store
  })

  it('correctly deploys', async () => {
    const coverKey = key.toBytes32('test')
    const liquidityToken = await deployer.deploy(cache, 'FakeToken', 'DAI Token', 'DAI', helper.ether(100_000_000, PRECISION), PRECISION)

    const vault = await deployer.deployWithLibraries(cache, 'Vault', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, store.address, coverKey, 'Vault', 'VAULT', liquidityToken.address)

    const _store = await vault.s()
    _store.should.equal(store.address)

    const version = await vault.version()
    version.should.equal(key.toBytes32('v0.1'))

    const name = await vault.getName()
    name.should.equal(key.PROTOCOL.CNAME.LIQUIDITY_VAULT)
  })
})
