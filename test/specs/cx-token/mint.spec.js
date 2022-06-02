const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const attacher = require('../../../util/attach')
const blockHelper = require('../../../util/block')

const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('cxToken: `mint` function', () => {
  let libraries, cxToken, store, policy

  const coverKey = key.toBytes32('test')

  beforeEach(async () => {
    const blockTimestamp = await blockHelper.getTimestamp()
    const expiryDate = blockTimestamp.add(2, 'd').unix()

    libraries = await deployDependencies()
    store = await deployer.deploy(cache, 'MockCxTokenStore')
    cxToken = await deployer.deployWithLibraries(cache, 'cxToken', libraries.dependencies, store.address, coverKey, helper.emptyBytes32, expiryDate)
    policy = await deployer.deploy(cache, 'MockCxTokenPolicy', cxToken.address)
  })

  it('must correctly mint', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    await store.initialize()
    await store.registerPolicyContract(policy.address)

    await policy.callMint(coverKey, helper.emptyBytes32, to, amount)
  })

  it('must reject when the protocol is paused', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    const protocolAddress = await store.callStatic.initialize()
    await store.initialize()
    await store.registerPolicyContract(policy.address)

    const protocol = await attacher.protocol.attach(protocolAddress, libraries.all)
    await protocol.setPaused(true)

    await policy.callMint(coverKey, helper.emptyBytes32, to, amount).should.be.rejectedWith('Protocol is paused')
  })

  it('must reject when invalid amount is supplied', async () => {
    const to = helper.randomAddress()
    const amount = '0'

    await store.initialize()
    await store.registerPolicyContract(policy.address)

    await policy.callMint(coverKey, helper.emptyBytes32, to, amount).should.be.rejectedWith('Please specify amount')
  })

  it('must reject when invalid cover key is supplied', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    await store.initialize()
    await store.registerPolicyContract(policy.address)

    await policy.callMint(key.toBytes32('foobar'), helper.emptyBytes32, to, amount)
      .should.be.rejectedWith('Invalid cover')
  })

  it('must reject when the caller is not policy contract', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    await store.initialize()

    await policy.callMint(coverKey, helper.emptyBytes32, to, amount).should.be.rejectedWith('Access denied')
  })
})
