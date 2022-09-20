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

describe('Create Bond', () => {
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
      npmToTopUpNow: helper.ether(2000)
    }

    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)

    await pool.setup(payload)
  })

  it('must correctly create a bond', async () => {
    const [owner] = await ethers.getSigners()
    const tokensDesired = await pool.calculateTokensForLp(helper.ether(1800))

    await npmDai.approve(pool.address, helper.ether(1800))
    const tx = await pool.createBond(helper.ether(1800), tokensDesired)
    const { events } = await tx.wait()

    const { timestamp } = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    const mustUnlockAt = timestamp + parseInt(payload.vestingTerm)

    const event = events.find(x => x.event === 'BondCreated')
    event.args.account.should.equal(owner.address)
    event.args.lpTokens.should.equal(helper.ether(1800))
    event.args.npmToVest.should.equal(tokensDesired)
    event.args.unlockDate.should.eq(mustUnlockAt.toString())
  })

  it('must revert if zero value is specified for `lpTokens`', async () => {
    const tokensDesired = await pool.calculateTokensForLp(helper.ether(200))

    await npmDai.approve(pool.address, helper.ether(200))
    await pool.createBond('0', tokensDesired)
      .should.be.rejectedWith('Please specify `lpTokens`')
  })

  it('must revert if zero value is specified for `minNpmDesired`', async () => {
    await npmDai.approve(pool.address, helper.ether(200))
    await pool.createBond(helper.ether(200), '0')
      .should.be.rejectedWith('Please enter `minNpmDesired`')
  })

  it('must revert if the protocol is paused', async () => {
    const tokensDesired = await pool.calculateTokensForLp(helper.ether(200))

    await deployed.protocol.pause()
    await npmDai.approve(pool.address, helper.ether(200))
    await pool.createBond(helper.ether(200), tokensDesired)
      .should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })

  it('must revert if the bond amount is too large', async () => {
    const tokensDesired = await pool.calculateTokensForLp(helper.ether(200))

    await npmDai.approve(pool.address, helper.ether(200))
    await pool.createBond(helper.ether(2000000), tokensDesired)
      .should.be.rejectedWith('Bond too big')
  })

  it('must revert if the minimum NPM desired is too big', async () => {
    const tokensDesired = helper.ether(100_000)

    await npmDai.approve(pool.address, helper.ether(200))
    await pool.createBond(helper.ether(200), tokensDesired)
      .should.be.rejectedWith('Min bond `minNpmDesired` failed')
  })

  it('must revert if the contract no more NPM left to bond', async () => {
    const amount = helper.ether(90_000)
    const tokensDesired = await pool.calculateTokensForLp(amount)

    await npmDai.approve(pool.address, amount)
    await pool.createBond(amount, tokensDesired)
      .should.be.rejectedWith('NPM balance insufficient to bond')
  })
})
