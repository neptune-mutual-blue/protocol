/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const { ethers } = require('hardhat')
const MINUTES = 60
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Setup Bond', () => {
  let deployed, store, npmDai, bondPoolLibV1, accessControlLibV1, baseLibV1, priceLibV1, validationLibV1, pool, payload

  before(async () => {
    deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    validationLibV1 = deployed.validationLibV1
    bondPoolLibV1 = deployed.bondPoolLibV1
    priceLibV1 = deployed.priceLibV1
    priceLibV1 = deployed.priceLibV1
    npmDai = deployed.npmDai

    pool = await deployer.deployWithLibraries(cache, 'BondPool', {
      AccessControlLibV1: accessControlLibV1.address,
      BondPoolLibV1: bondPoolLibV1.address,
      BaseLibV1: baseLibV1.address,
      PriceLibV1: priceLibV1.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.BOND_POOL, pool.address)

    payload = {
      lpToken: npmDai.address,
      treasury: helper.randomAddress(),
      bondDiscountRate: helper.percentage(1),
      maxBondAmount: helper.ether(100_000),
      vestingTerm: (5 * MINUTES).toString(),
      npmToTopUpNow: helper.ether(10_000_000)
    }
  })

  it('must correctly set up the bond pool', async () => {
    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)

    const tx = await pool.setup(payload)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'BondPoolSetup')

    for (const i in event.args.addresses) {
      event.args.addresses[i].should.equal(payload.addresses[i])
    }

    for (const i in event.args.values) {
      event.args.values[i].toString().should.equal(payload.values[i])
    }
  })

  it('must allow updating the bond pool values without top up', async () => {
    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)

    await pool.setup({
      lpToken: helper.zerox,
      treasury: helper.zerox,
      bondDiscountRate: '0',
      maxBondAmount: '0',
      vestingTerm: '0',
      npmToTopUpNow: '0'
    })
  })

  it('must reject if invoked by non admin', async () => {
    const [owner, bob] = await ethers.getSigners()

    const amount = payload.npmToTopUpNow

    await deployed.npm.transfer(bob.address, amount)
    await deployed.npm.connect(bob).approve(pool.address, amount)

    await pool.connect(bob).setup(payload)
      .should.be.rejectedWith('Forbidden')

    await deployed.npm.connect(bob).transfer(owner.address, amount)
  })

  it('must reject if the protocol is paused', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.protocol.grantRoles([{ account: owner.address, roles: [key.ACCESS_CONTROL.PAUSE_AGENT, key.ACCESS_CONTROL.UNPAUSE_AGENT] }])
    await deployed.protocol.pause()

    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)
    await pool.setup(payload)
      .should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })
})
