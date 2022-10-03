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
  let deployed, store, pool, payload

  before(async () => {
    deployed = await deployDependencies()

    store = deployed.store

    pool = await deployer.deployWithLibraries(cache, 'BondPool', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BondPoolLibV1: deployed.bondPoolLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      PriceLibV1: deployed.priceLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.BOND_POOL, pool.address)

    payload = {
      lpToken: deployed.npmDai.address,
      treasury: helper.randomAddress(),
      bondDiscountRate: helper.percentage(1),
      maxBondAmount: helper.ether(100_000),
      vestingTerm: (5 * MINUTES).toString(),
      npmToTopUpNow: helper.ether(10_000_000)
    }

    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)

    await pool.setup(payload)
  })

  it('must correctly claim a bond', async () => {
    const [owner] = await ethers.getSigners()
    const tokensDesired = await pool.calculateTokensForLp(helper.ether(200))

    await deployed.npmDai.approve(pool.address, helper.ether(200))
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

    await deployed.npmDai.approve(pool.address, helper.ether(200))
    await pool.createBond(helper.ether(200), tokensDesired)

    await network.provider.send('evm_increaseTime', [5 * MINUTES])

    await deployed.protocol.pause()
    await pool.claimBond().should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('must revert claims when bond is still vesting', async () => {
    const [, bob] = await ethers.getSigners()
    const amount = helper.ether(200)
    const tokensDesired = await pool.calculateTokensForLp(amount)

    await deployed.npmDai.transfer(bob.address, amount)

    await deployed.npmDai.connect(bob).approve(pool.address, amount)
    await pool.connect(bob).createBond(amount, tokensDesired)
    await pool.connect(bob).claimBond()
      .should.be.rejectedWith('Still vesting')
  })
})
