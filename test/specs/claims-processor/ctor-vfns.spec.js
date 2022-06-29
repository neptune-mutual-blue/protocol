const moment = require('moment')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')

const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Claims Processor: Constructor & Initializer', () => {
  let libraries, store, processor

  before(async () => {
    libraries = await deployDependencies()
    const storeLib = await deployer.deploy(cache, 'MockProcessorStoreLib')

    store = await deployer.deployWithLibraries(cache, 'MockProcessorStore', { MockProcessorStoreLib: storeLib.address })
    processor = await deployer.deployWithLibraries(cache, 'Processor', libraries.dependencies, store.address)
  })

  it('must successfully constructs the processor contract', async () => {
    (await processor.s()).should.equal(store.address)
  })

  it('must ensure correct version number', async () => {
    (await processor.version()).should.equal(key.toBytes32('v0.1'))
  })

  it('must ensure correct contract namespace', async () => {
    (await processor.getName()).should.equal(key.PROTOCOL.CNAME.CLAIMS_PROCESSOR)
  })
})

describe('Claims Processor: `getClaimExpiryDate` function', () => {
  let libraries, cxToken, store, processor

  before(async () => {
    libraries = await deployDependencies()
    cxToken = await deployer.deploy(cache, 'MockCxToken')
    const storeLib = await deployer.deploy(cache, 'MockProcessorStoreLib')

    store = await deployer.deployWithLibraries(cache, 'MockProcessorStore', { MockProcessorStoreLib: storeLib.address })
    processor = await deployer.deployWithLibraries(cache, 'Processor', libraries.dependencies, store.address)
  })

  it('must correctly return the claim expiry date', async () => {
    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    const startedOn = moment.unix(block.timestamp)

    const coverKey = key.toBytes32('test')

    await store.initialize(coverKey, helper.emptyBytes32, cxToken.address)

    const date = await processor.getClaimExpiryDate(coverKey, helper.emptyBytes32)

    date.toNumber().should.be.greaterThan(startedOn.add(100, 'd').unix())
    date.toNumber().should.be.lessThan(startedOn.add(101, 'd').unix())
  })
})
