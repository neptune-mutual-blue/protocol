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

describe('Bond: Calculate Tokens for LP', () => {
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

  it('correctly calculates NPM tokens for specified LP tokens', async () => {
    const npmTokens = await pool.calculateTokensForLp(helper.ether(200))
    npmTokens.should.equal('101010101010101010101')
  })
})
