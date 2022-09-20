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

describe('Bond: NPM Token Price', () => {
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

    await deployed.npm.approve(pool.address, ethers.constants.MaxUint256)

    await pool.setup(payload)
  })

  it('correctly returns the NPM token price', async () => {
    const price = await pool.getNpmMarketPrice()
    price.should.equal(helper.ether(2))
  })
})
