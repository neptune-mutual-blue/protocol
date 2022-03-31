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

  it('must correctly return result', async () => {
    const [owner] = await ethers.getSigners()
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

    const info = await pool.getInfo(owner.address)
    const [
      [lpToken],
      [marketPrice, discountRate, vestingTerm, maxBond,
        totalNpmAllocated, totalNpmDistributed, npmAvailable, bondContribution,
        claimable, unlockDate]
    ] = info

    lpToken.should.equal(payload.addresses[0])
    marketPrice.should.be.gt('0')
    discountRate.should.equal(payload.values[0])
    maxBond.should.equal(payload.values[1])
    vestingTerm.should.equal(payload.values[2])
    totalNpmAllocated.should.equal(payload.values[3])
    totalNpmDistributed.should.equal('0')
    npmAvailable.should.equal(payload.values[3])
    bondContribution.should.equal('0')
    claimable.should.equal('0')
    unlockDate.should.equal('0')
  })

  it('must allow updating the bond pool values without top up', async () => {
    const [owner] = await ethers.getSigners()
    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)

    const cloned = JSON.parse(JSON.stringify(payload))

    cloned.values = [helper.percentage(2), // 1% bond discount
      helper.ether(500_000), // Maximum bond amount
      (1 * MINUTES).toString(), // Bond period / vesting term
      '0' // NPM to top up
    ]

    const tx = await pool.setup(cloned.addresses, cloned.values)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'BondPoolSetup')

    for (const i in event.args.addresses) {
      event.args.addresses[i].should.equal(cloned.addresses[i])
    }

    for (const i in event.args.values) {
      event.args.values[i].toString().should.equal(cloned.values[i])
    }

    const info = await pool.getInfo(owner.address)
    const [
      [lpToken],
      [marketPrice, discountRate, vestingTerm, maxBond,
        totalNpmAllocated, totalNpmDistributed, npmAvailable, bondContribution,
        claimable, unlockDate]
    ] = info

    lpToken.should.equal(cloned.addresses[0])
    marketPrice.should.be.gt('0')
    discountRate.should.equal(cloned.values[0])
    maxBond.should.equal(cloned.values[1])
    vestingTerm.should.equal(cloned.values[2])
    totalNpmAllocated.should.equal(payload.values[3]) // because nothing was added in this transaction
    totalNpmDistributed.should.equal('0')
    npmAvailable.should.equal(payload.values[3])
    bondContribution.should.equal('0')
    claimable.should.equal('0')
    unlockDate.should.equal('0')
  })
})
