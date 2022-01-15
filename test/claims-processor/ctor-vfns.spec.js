const moment = require('moment')
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../util')
const { deployDependencies } = require('./deps')

const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Claims Processor: Constructor & Initializer', () => {
  let libraries, store, processor

  beforeEach(async () => {
    libraries = await deployDependencies()
    store = await deployer.deploy(cache, 'MockProcessorStore')
    processor = await deployer.deployWithLibraries(cache, 'Processor', libraries.dependencies, store.address)
  })

  it('must successfully constructs the processor contract', async () => {
    (await processor.s()).should.equal(store.address)
  })

  it('must ensure correct version number', async () => {
    (await processor.version()).should.equal(key.toBytes32('v0.1'))
  })

  it('must ensure correct contract namespace', async () => {
    (await processor.getName()).should.equal(key.CNAME_KEYS)
  })
})

describe('Claims Processor: `getClaimExpiryDate` function', () => {
  let libraries, cxToken, store, processor

  beforeEach(async () => {
    libraries = await deployDependencies()
    cxToken = await deployer.deploy(cache, 'MockCxToken')
    store = await deployer.deploy(cache, 'MockProcessorStore')
    processor = await deployer.deployWithLibraries(cache, 'Processor', libraries.dependencies, store.address)
  })

  it('must correctly return the claim expiry date', async () => {
    const startedOn = moment(new Date())

    const coverKey = key.toBytes32('test')

    await store.initialize(coverKey, cxToken.address)

    const date = await processor.getClaimExpiryDate(coverKey)

    date.should.be.gt(startedOn.add(100, 'd').unix())
    date.should.be.lt(startedOn.add(101, 'd').unix())
  })
})
