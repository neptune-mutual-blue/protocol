/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const pair = require('../../../../util/composer/uniswap-pair')
const { ethers } = require('hardhat')
const MINUTES = 60
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Setup Bond', () => {
  let deployed, store, dai, npmDai, bondPoolLibV1, accessControlLibV1, baseLibV1, priceLibV1, validationLibV1, pool, payload

  before(async () => {
    deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    validationLibV1 = deployed.validationLibV1
    bondPoolLibV1 = deployed.bondPoolLibV1
    priceLibV1 = deployed.priceLibV1

    dai = await deployer.deploy(cache, 'FakeToken', 'DAI', 'DAI', helper.ether(100_000_000))
    ;[[npmDai]] = await pair.deploySeveral(cache, [{ token0: deployed.npm.address, token1: dai.address }])

    pool = await deployer.deployWithLibraries(cache, 'BondPool', {
      AccessControlLibV1: accessControlLibV1.address,
      BondPoolLibV1: bondPoolLibV1.address,
      BaseLibV1: baseLibV1.address,
      PriceLibV1: priceLibV1.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.BOND_POOL, pool.address)

    payload = {
      addresses: [
        npmDai.address,
        helper.randomAddress() // treasury
      ],
      values: [
        helper.percentage(1), // 1% bond discount
        helper.ether(100_000), // Maximum bond amount
        (5 * MINUTES).toString(), // Bond period / vesting term
        helper.ether(10_000_000) // NPM to top up
      ]
    }
  })

  it('must correctly set up the bond pool', async () => {
    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)

    const tx = await pool.setup(payload.addresses, payload.values)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'BondPoolSetup')

    for (const i in event.args.addresses) {
      event.args.addresses[i].should.equal(payload.addresses[i])
    }

    for (const i in event.args.values) {
      event.args.values[i].toString().should.equal(payload.values[i])
    }
  })

  it('must reject if invoked by non admin', async () => {
    const [owner, bob] = await ethers.getSigners()

    const amount = payload.values[payload.values.length - 1]

    await deployed.npm.transfer(bob.address, amount)
    await deployed.npm.connect(bob).approve(pool.address, amount)

    await pool.connect(bob).setup(payload.addresses, payload.values)
      .should.be.rejectedWith('Forbidden')

    await deployed.npm.connect(bob).transfer(owner.address, amount)
  })

  it('must reject if the protocol is paused', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.protocol.grantRoles([{ account: owner.address, roles: [key.ACCESS_CONTROL.PAUSE_AGENT, key.ACCESS_CONTROL.UNPAUSE_AGENT] }])
    await deployed.protocol.pause()

    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)
    await pool.setup(payload.addresses, payload.values)
      .should.be.rejectedWith('Protocol is paused')

    // await deployed.protocol.unpause()
  })
})
