/* eslint-disable no-unused-expressions */
const { network, ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key, ipfs, sample } = require('../../util')
const composer = require('../../util/composer')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS
const formatEther = helper.weiAsToken

const coverKey = key.toBytes32('Compound Finance Cover')

/**
 * @type {Contracts}
 */
let contracts = {}

describe('Fractionalization of Standalone Pool Reserves', () => {
  beforeEach(async () => {
    contracts = await composer.initializer.initialize(true)

    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const initialLiquidity = helper.ether(4_000_000, PRECISION)
    const stakeWithFee = helper.ether(10_000)
    const minReportingStake = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)
    const reassuranceRate = helper.percentage(50)
    const leverage = '1'

    await contracts.npm.approve(contracts.stakingContract.address, stakeWithFee)

    const requiresWhitelist = false
    const values = [stakeWithFee, '0', minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]
    await contracts.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)

    const vault = await composer.vault.getVault(contracts, coverKey)

    await contracts.dai.approve(vault.address, initialLiquidity)
    await contracts.npm.approve(vault.address, minReportingStake)
    await vault.addLiquidity(coverKey, initialLiquidity, minReportingStake, key.toBytes32(''))
  })

  it('does not allow fractional reserves', async () => {
    const [owner] = await ethers.getSigners()
    let totalPurchased = 0
    const amount = 2_000_000
    const args = [owner.address, coverKey, helper.emptyBytes32, 2, helper.ether(amount, PRECISION), key.toBytes32('REF-CODE-001')]

    let totalFee = ethers.BigNumber.from(0)

    for (let i = 0; i < 2; i++) {
      const info = (await contracts.policy.getCoverFeeInfo(args[1], args[2], args[3], args[4]))
      const fee = info.fee
      const available = info.totalAvailableLiquidity

      totalFee = totalFee.add(fee)

      console.info('[#%s] Fee: %s. Total fee: %s. Total purchased %s. Available Now: %s', i + 1, formatEther(fee, 'DAI', PRECISION), formatEther(totalFee, 'DAI', PRECISION), totalPurchased.toLocaleString(), formatEther(available, 'DAI', PRECISION))

      await contracts.dai.approve(contracts.policy.address, fee)
      await contracts.policy.purchaseCover(...args)

      totalPurchased += amount
    }

    const info = await contracts.policy.getCoverFeeInfo(coverKey, helper.emptyBytes32, 2, '1')
    await contracts.policy.getCoverFeeInfo(coverKey, helper.emptyBytes32, 2, info.totalAvailableLiquidity.sub(totalPurchased).add(1)).should.be.rejectedWith('Insufficient fund')
  })

  it('allows reuse of liquidity as policies expire', async () => {
    const [owner] = await ethers.getSigners()
    let totalPurchased = 0
    const amount = 250_000

    // Never ending
    for (let i = 0; i < 20; i++) {
      const args = [owner.address, coverKey, helper.emptyBytes32, 2, helper.ether(amount, PRECISION), key.toBytes32('REF-CODE-001')]
      const info = (await contracts.policy.getCoverFeeInfo(args[1], args[2], args[3], args[4]))
      const fee = info.fee
      const available = info.totalAvailableLiquidity

      console.info('[#%s] Fee: %s. Total purchased %s. Available Now: %s', i + 1, formatEther(fee, 'DAI', PRECISION), totalPurchased.toLocaleString(), formatEther(available, 'DAI', PRECISION))

      await contracts.dai.approve(contracts.policy.address, ethers.constants.MaxUint256)
      await contracts.policy.purchaseCover(...args)

      totalPurchased += amount
      await network.provider.send('evm_increaseTime', [7 * DAYS])
    }
  })

  it('commitments expire over time', async () => {
    const [owner] = await ethers.getSigners()
    const amount = 250_000

    for (let i = 0; i < 9; i++) {
      const args = [owner.address, coverKey, helper.emptyBytes32, 1, helper.ether(amount, PRECISION), key.toBytes32('REF-CODE-001')]
      const info = (await contracts.policy.getCoverFeeInfo(args[1], args[2], args[3], args[4]))
      const fee = info.fee

      if (i < 4) {
        await contracts.dai.approve(contracts.policy.address, fee)
        await contracts.policy.purchaseCover(...args)
      }

      await network.provider.send('evm_increaseTime', [7 * DAYS])
      // Dummy transaction
      await contracts.npm.approve(contracts.governance.address, helper.ether(1000))
    }

    const commitment = await contracts.policy.getCommitment(coverKey, helper.emptyBytes32)
    commitment.should.equal('0')
  })
})
