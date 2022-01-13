const moment = require('moment')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../util')
const { deployDependencies } = require('./deps')
const attacher = require('../util/attach')

const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('cxToken: Constructor', () => {
  let libraries, cxToken, store, policy

  const coverKey = key.toBytes32('test')
  const expiryDate = moment(new Date()).add(2, 'd').unix()

  beforeEach(async () => {
    libraries = await deployDependencies()
    store = await deployer.deploy(cache, 'MockCxTokenStore')
    cxToken = await deployer.deployWithLibraries(cache, 'cxToken', libraries.dependencies, store.address, coverKey, expiryDate)
    policy = await deployer.deploy(cache, 'MockCxTokenPolicy', cxToken.address)
  })

  it('must correctly mint', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    await store.initialize()
    await store.registerPolicyContract(policy.address)

    await policy.callMint(coverKey, to, amount)
  })

  it('must reject when the protocol is paused', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    const protocolAddress = await store.callStatic.initialize()
    await store.initialize()
    await store.registerPolicyContract(policy.address)

    const protocol = await attacher.protocol.attach(protocolAddress, libraries.all)
    await protocol.setPaused(true)

    await policy.callMint(coverKey, to, amount).should.be.revertedWith('Protocol is paused')
  })

  it('must reject when invalid cover key is supplied', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    await store.initialize()
    await store.registerPolicyContract(policy.address)

    await policy.callMint(key.toBytes32('foobar'), to, amount)
      .should.be.revertedWith('Invalid cover')
  })

  it('must reject when the caller is not policy contract', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    await store.initialize()

    await policy.callMint(coverKey, to, amount).should.be.revertedWith('Access denied')
  })
})
