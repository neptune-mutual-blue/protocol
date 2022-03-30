const BigNumber = require('bignumber.js')
const { deployDependencies } = require('./deps')
const { deployer, key } = require('../../../util')
const attacher = require('../../../util/attach')
const blockHelper = require('../../../util/block')

const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('cxToken: `burn` function', () => {
  let libraries, cxToken, store, policy

  const coverKey = key.toBytes32('test')

  beforeEach(async () => {
    const blockTimestamp = await blockHelper.getTimestamp()
    const expiryDate = blockTimestamp.add(2, 'd').unix()

    libraries = await deployDependencies()
    store = await deployer.deploy(cache, 'MockCxTokenStore')
    cxToken = await deployer.deployWithLibraries(cache, 'cxToken', libraries.dependencies, store.address, coverKey, expiryDate)
    policy = await deployer.deploy(cache, 'MockCxTokenPolicy', cxToken.address)
  })

  it('must correctly burn', async () => {
    const [owner] = await ethers.getSigners()
    const amount = '100'

    await store.initialize()
    await store.registerPolicyContract(policy.address)

    await policy.callMint(coverKey, owner.address, amount)

    await cxToken.burn('85')

    const balance = await cxToken.balanceOf(owner.address)
    balance.should.equal('15')
  })

  it('must reject when the protocol is paused', async () => {
    const [owner] = await ethers.getSigners()
    const amount = '100'

    const protocolAddress = await store.callStatic.initialize()
    await store.initialize()
    await store.registerPolicyContract(policy.address)

    const protocol = await attacher.protocol.attach(protocolAddress, libraries.all)
    await policy.callMint(coverKey, owner.address, amount)

    await protocol.setPaused(true)

    await cxToken.burn('85')
      .should.be.rejectedWith('Protocol is paused')
  })
})
