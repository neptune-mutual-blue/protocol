/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const { ethers, network } = require('hardhat')
const MINUTES = 60
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Claim Bond', () => {
  let deployed, store, npmDai, bondPoolLibV1, accessControlLibV1, baseLibV1, priceLibV1, validationLibV1, pool, payload, routineInvokerLibV1

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

    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)

    await pool.setup(payload.addresses, payload.values)
  })

  it('must correctly claim a bond', async () => {
    const [owner] = await ethers.getSigners()
    const tokensDesired = await pool.calculateTokensForLp(helper.ether(200))

    await npmDai.approve(pool.address, helper.ether(200))
    await pool.createBond(helper.ether(200), tokensDesired)

    await network.provider.send('evm_increaseTime', [5 * MINUTES])

    const tx = await pool.claimBond()
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'BondClaimed')

    event.args.account.should.equal(owner.address)
    event.args.amount.should.equal(tokensDesired)
  })

  it('must revert if the nothing was bonded', async () => {
    const [, bob] = await ethers.getSigners()
    await pool.connect(bob).claimBond().should.be.rejectedWith('Nothing to claim')
  })

  it('must revert if the protocol is paused', async () => {
    const tokensDesired = await pool.calculateTokensForLp(helper.ether(200))

    await npmDai.approve(pool.address, helper.ether(200))
    await pool.createBond(helper.ether(200), tokensDesired)

    await network.provider.send('evm_increaseTime', [5 * MINUTES])

    await deployed.protocol.pause()
    await pool.claimBond().should.be.rejectedWith('Protocol is paused')
  })
})
