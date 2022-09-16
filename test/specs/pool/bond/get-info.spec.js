/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const pair = require('../../../../util/composer/uniswap-pair')
const { ethers } = require('hardhat')
const MINUTES = 60
const cache = null
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Bond Pool: Get Info', () => {
  let deployed, store, dai, npmDai, bondPoolLibV1, accessControlLibV1, baseLibV1, priceLibV1, validationLibV1, pool, payload

  before(async () => {
    deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    validationLibV1 = deployed.validationLibV1
    bondPoolLibV1 = deployed.bondPoolLibV1
    priceLibV1 = deployed.priceLibV1

    dai = await deployer.deploy(cache, 'FakeToken', 'DAI', 'DAI', helper.ether(100_000_000, PRECISION), PRECISION)
    ;[[npmDai]] = await pair.deploySeveral(cache, [{ token0: deployed.npm, token1: dai }])

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

  it('must correctly return result', async () => {
    const [owner] = await ethers.getSigners()
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

    const info = await pool.getInfo(owner.address)

    info.lpToken.should.equal(payload.lpToken)
    info.marketPrice.should.be.gt('0')
    info.discountRate.should.equal(payload.bondDiscountRate)
    info.vestingTerm.should.equal(payload.vestingTerm)
    info.maxBond.should.equal(payload.maxBondAmount)
    info.totalNpmAllocated.should.equal(payload.npmToTopUpNow) // because nothing was added in this transaction
    info.totalNpmDistributed.should.equal('0')
    info.npmAvailable.should.equal(payload.npmToTopUpNow)
    info.bondContribution.should.equal('0')
    info.claimable.should.equal('0')
    info.unlockDate.should.equal('0')
  })

  it('must allow updating the bond pool values without top up', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)

    const args = {
      ...payload,
      bondDiscountRate: helper.percentage(2),
      maxBondAmount: helper.ether(500_000),
      vestingTerm: (1 * MINUTES).toString(),
      npmToTopUpNow: '0'
    }

    await pool.setup(args)

    const info = await pool.getInfo(owner.address)

    info.lpToken.should.equal(args.lpToken)
    info.marketPrice.should.be.gt('0')
    info.discountRate.should.equal(args.bondDiscountRate)
    info.vestingTerm.should.equal(args.vestingTerm)
    info.maxBond.should.equal(args.maxBondAmount)
    info.totalNpmAllocated.should.equal(payload.npmToTopUpNow) // because nothing was added in this transaction
    info.totalNpmDistributed.should.equal('0')
    info.npmAvailable.should.equal(payload.npmToTopUpNow)
    info.bondContribution.should.equal('0')
    info.claimable.should.equal('0')
    info.unlockDate.should.equal('0')
  })
})
