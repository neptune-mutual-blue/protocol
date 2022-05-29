const moment = require('moment')
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const blockHelper = require('../../../util/block')

const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('cxToken: `getCoverageStartsFrom` function', () => {
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

  it('must correctly give the coverage starts from amount', async () => {
    const [owner] = await ethers.getSigners()

    const amount = '1'

    await store.initialize()
    await store.registerPolicyContract(policy.address)

    await policy.callMint(coverKey, owner.address, amount)

    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())

    const tomorrowEOD = moment((block.timestamp + 1 * DAYS) * 1000).utc().endOf('day').unix()
    const coverageStartsFrom = await cxToken.getCoverageStartsFrom(owner.address, tomorrowEOD)
    coverageStartsFrom.should.equal(amount)
  })

  it('must return zero when no policies are purchased', async () => {
    const [, bob] = await ethers.getSigners()

    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())

    const coverageStartsFrom = await cxToken.getCoverageStartsFrom(bob.address, block.timestamp)
    await coverageStartsFrom.should.equal(0)
  })
})
