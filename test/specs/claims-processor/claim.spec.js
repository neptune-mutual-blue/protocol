const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')

const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Claims Processor: `claim` function', () => {
  let libraries, store, cxToken, processor

  before(async () => {
    libraries = await deployDependencies()

    const storeLib = await deployer.deploy(cache, 'MockProcessorStoreLib')

    store = await deployer.deployWithLibraries(cache, 'MockProcessorStore', { MockProcessorStoreLib: storeLib.address })
    cxToken = await deployer.deploy(cache, 'MockCxToken')
    processor = await deployer.deployWithLibraries(cache, 'Processor', libraries.dependencies, store.address)
  })

  it('must succeed if all conditions are met', async () => {
    const coverKey = key.toBytes32('test')
    const incidentDate = '1234'

    await store.initialize(coverKey, cxToken.address)
    await cxToken.approve(processor.address, '1')

    await processor.claim(cxToken.address, coverKey, incidentDate, '1')
  })

  it('must correctly emit `Claimed` event', async () => {
    const [owner] = await ethers.getSigners()
    const coverKey = key.toBytes32('test')
    const incidentDate = '1234'
    const amount = '1'

    await store.initialize(coverKey, cxToken.address)
    await cxToken.approve(processor.address, '1')

    const tx = await processor.claim(cxToken.address, coverKey, incidentDate, amount)
    const { events } = await tx.wait()
    const event = events.pop()

    event.event.should.equal('Claimed')
    event.args.cxToken.should.equal(cxToken.address)
    event.args.key.should.equal(coverKey)
    event.args.account.should.equal(owner.address)
    event.args.reporter.should.equal(helper.zerox)
    event.args.amount.toString().should.equal(amount)
    event.args.reporterFee.toNumber().should.equal(0)
    event.args.platformFee.toNumber().should.equal(0)
    event.args.claimed.toNumber().should.equal(1)
  })

  it('must revert if invalid amount is specified', async () => {
    const coverKey = key.toBytes32('test')
    const incidentDate = '1234'

    await store.initialize(coverKey, cxToken.address)
    await cxToken.approve(processor.address, '1')

    await processor.claim(cxToken.address, coverKey, incidentDate, '0')
      .should.be.rejectedWith('Enter an amount')
  })
})
