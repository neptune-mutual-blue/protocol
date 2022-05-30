/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Policy Admin: setCoverageLag', () => {
  let deployed, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()
    coverKey = key.toBytes32('foo-bar')

    deployed.policyAdminContract = await deployer.deployWithLibraries(cache, 'PolicyAdmin', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      PolicyHelperV1: deployed.policyHelperV1.address,
      RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY_ADMIN, deployed.policyAdminContract.address)

    coverKey = key.toBytes32('foo-bar')
    const values = [helper.ether(10_000), '0', helper.ether(100), 7 * DAYS, 1 * DAYS, 7 * DAYS, helper.percentage(1), helper.percentage(100), helper.percentage(30)]
    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, helper.ether(10_000))

    await deployed.cover.addCover(coverKey, info, deployed.dai.address, false, values)
    await deployed.cover.deployVault(coverKey)
  })

  it('succeeds without any errors if zero is specified as cover key', async () => {
    // If not set a particular coverage lag, we get the fallback coverage lag - 1 * DAYS
    const before = await deployed.policyAdminContract.getCoverageLag(coverKey)
    before.should.equal(1 * DAYS)

    const window = 2 * DAYS

    // Sets the global coverage lag, when coverKey is 0
    const tx = await deployed.policyAdminContract.setCoverageLag(key.toBytes32(''), window)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'CoverageLagSet')

    event.args.coverKey.should.equal(key.toBytes32(''))
    event.args.window.should.equal(window)

    const after = await deployed.policyAdminContract.getCoverageLag(coverKey)
    after.should.equal(window)
  })

  it('succeeds without any errors', async () => {
    const window = 2 * DAYS

    const tx = await deployed.policyAdminContract.setCoverageLag(coverKey, window)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'CoverageLagSet')

    event.args.coverKey.should.equal(coverKey)
    event.args.window.should.equal(window)

    const result = await deployed.policyAdminContract.getCoverageLag(coverKey)
    result.should.equal(window)
  })

  it('reverts when invalid cover key is entered', async () => {
    await deployed.policyAdminContract.setCoverageLag(key.toBytes32('fizzbuzz'), 1 * DAYS)
      .should.be.rejectedWith('Cover does not exist')
  })

  it('reverts when zero is specified as window', async () => {
    await deployed.policyAdminContract.setCoverageLag(coverKey, 0.5 * DAYS)
      .should.be.rejectedWith('Enter at least 1 day')
  })

  it('reverts when not accessed by cover manager', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.policyAdminContract.connect(bob).setCoverageLag(coverKey, 1 * DAYS)
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when the protocol is paused', async () => {
    await deployed.protocol.pause()

    await deployed.policyAdminContract.setCoverageLag(coverKey, 1 * DAYS)
      .should.be.rejectedWith('Protocol is paused')
  })
})
