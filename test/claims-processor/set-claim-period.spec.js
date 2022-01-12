const moment = require('moment')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../util')
const { deployDependencies } = require('./deps')
const attacher = require('../util/attach')
const DAYS = 86400

const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Claims Processor: `setClaimPeriod` function', () => {
  let libraries, store, cxToken, processor

  beforeEach(async () => {
    libraries = await deployDependencies()

    store = await deployer.deploy(cache, 'MockProcessorStore')
    cxToken = await deployer.deploy(cache, 'MockCxToken')
    processor = await deployer.deployWithLibraries(cache, 'Processor', libraries.dependencies, store.address)
  })

  it('must succeed if all conditions are met', async () => {
    const [owner] = await ethers.getSigners()
    const newClaimPeriod = 7 * DAYS
    const coverKey = key.toBytes32('test')

    const [protocolAddress] = await store.callStatic.initialize(coverKey, cxToken.address)
    await store.initialize(coverKey, cxToken.address)

    const protocol = await attacher.protocol.attach(protocolAddress, libraries.all)

    await protocol.setupRole(key.NS.ROLES.ADMIN, key.NS.ROLES.ADMIN, owner.address)
    await protocol.setupRole(key.NS.ROLES.COVER_MANAGER, key.NS.ROLES.ADMIN, owner.address)

    const tx = await processor.setClaimPeriod(newClaimPeriod)
    const { events } = await tx.wait()
    const [event] = events

    events.length.should.equal(1)

    event.event.should.equal('ClaimPeriodSet')
    event.args.previous.should.equal('0')
    event.args.current.should.equal(newClaimPeriod)
  })

  it('must reject if the protocol is paused', async () => {
    const newClaimPeriod = 7 * DAYS
    const coverKey = key.toBytes32('test')

    const [protocolAddress] = await store.callStatic.initialize(coverKey, cxToken.address)
    await store.initialize(coverKey, cxToken.address)

    const protocol = await attacher.protocol.attach(protocolAddress, libraries.all)

    await protocol.setPaused(true)

    await processor.setClaimPeriod(newClaimPeriod).should.be.revertedWith('Protocol is paused')
  })

  it('must reject if accessed by anyone else but cover manager', async () => {
    const newClaimPeriod = 7 * DAYS
    const coverKey = key.toBytes32('test')

    await store.initialize(coverKey, cxToken.address)
    await processor.setClaimPeriod(newClaimPeriod).should.be.revertedWith('Forbidden')
  })
})
