/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Policy Admin: setPolicyRates', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()

    deployed.policyAdminContract = await deployer.deployWithLibraries(cache, 'PolicyAdmin', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      PolicyHelperV1: deployed.policyHelperV1.address,
      RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY_ADMIN, deployed.policyAdminContract.address)
  })

  it('succeeds without any errors', async () => {
    const floor = helper.percentage(6)
    const ceiling = helper.percentage(48)

    const tx = await deployed.policyAdminContract.setPolicyRates(floor, ceiling)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'PolicyRateSet')

    event.args.floor.should.equal(floor)
    event.args.ceiling.should.equal(ceiling)

    const info = await deployed.policyAdminContract.getPolicyRates(key.toBytes32(''))
    info.floor.should.equal(floor)
    info.ceiling.should.equal(ceiling)
  })

  it('reverts when zero is specified as floor value', async () => {
    await deployed.policyAdminContract.setPolicyRates('0', helper.percentage(10))
      .should.be.rejectedWith('Please specify floor')
  })

  it('reverts when zero is specified as ceiling value', async () => {
    await deployed.policyAdminContract.setPolicyRates(helper.percentage(1), '0')
      .should.be.rejectedWith('Invalid ceiling')
  })

  it('reverts when not accessed by cover manager', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.policyAdminContract.connect(bob).setPolicyRates(helper.percentage(1), helper.percentage(10))
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when the protocol is paused', async () => {
    await deployed.protocol.pause()

    await deployed.policyAdminContract.setPolicyRates(helper.percentage(1), helper.percentage(10))
      .should.be.rejectedWith('Protocol is paused')
  })
})
