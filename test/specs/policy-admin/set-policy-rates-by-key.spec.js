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

describe('Policy Admin: setPolicyRatesByKey', () => {
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
    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, helper.ether(10_000))

    await deployed.cover.addCover({
      coverKey,
      info,
      tokenName: 'POD',
      tokenSymbol: 'POD',
      supportsProducts: false,
      requiresWhitelist: false,
      stakeWithFee: helper.ether(10_000),
      initialReassuranceAmount: '0',
      minStakeToReport: helper.ether(100),
      reportingPeriod: 7 * DAYS,
      cooldownPeriod: 1 * DAYS,
      claimPeriod: 7 * DAYS,
      floor: helper.percentage(1),
      ceiling: helper.percentage(100),
      reassuranceRate: helper.percentage(30),
      leverageFactor: '1'
    })
  })

  it('succeeds without any errors', async () => {
    const floor = helper.percentage(6)
    const ceiling = helper.percentage(48)

    const tx = await deployed.policyAdminContract.setPolicyRatesByKey(coverKey, floor, ceiling)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'CoverPolicyRateSet')

    event.args.coverKey.should.equal(coverKey)
    event.args.floor.should.equal(floor)
    event.args.ceiling.should.equal(ceiling)

    const info = await deployed.policyAdminContract.getPolicyRates(coverKey)
    info.floor.should.equal(floor)
    info.ceiling.should.equal(ceiling)
  })

  it('reverts when invalid cover key is entered', async () => {
    await deployed.policyAdminContract.setPolicyRatesByKey(key.toBytes32('fizzbuzz'), helper.percentage(1), helper.percentage(10))
      .should.be.rejectedWith('Cover does not exist')
  })

  it('reverts when zero is specified as floor value', async () => {
    await deployed.policyAdminContract.setPolicyRatesByKey(coverKey, '0', helper.percentage(10))
      .should.be.rejectedWith('Please specify floor')
  })

  it('reverts when zero is specified as ceiling value', async () => {
    await deployed.policyAdminContract.setPolicyRatesByKey(coverKey, helper.percentage(1), '0')
      .should.be.rejectedWith('Invalid ceiling')
  })

  it('reverts when not accessed by cover manager', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.policyAdminContract.connect(bob).setPolicyRatesByKey(coverKey, helper.percentage(1), helper.percentage(10))
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when the protocol is paused', async () => {
    await deployed.protocol.pause()

    await deployed.policyAdminContract.setPolicyRatesByKey(coverKey, helper.percentage(1), helper.percentage(10))
      .should.be.rejectedWith('Protocol is paused')
  })
})
