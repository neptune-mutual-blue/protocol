/* eslint-disable no-unused-expressions */

const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key, ipfs, sample } = require('../../util')
const composer = require('../../util/composer')
const { approve } = require('../../util/contract-helper/erc20')
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const DAYS = 86400

const coverKey = key.toBytes32('Compound Finance Cover')

/**
 * @type {Contracts}
 */
let contracts = {}

describe('Liquidity Stories', () => {
  before(async () => {
    contracts = await composer.initializer.initialize(true)
  })

  it('a new cover `Bitmart Exchange Cover` was created', async () => {
    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const stakeWithFee = helper.ether(10_000)
    const minStakeToReport = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)
    const reassuranceRate = helper.percentage(50)

    await contracts.npm.approve(contracts.cover.address, stakeWithFee)
    await contracts.reassuranceToken.approve(contracts.cover.address, initialReassuranceAmount)

    await contracts.cover.addCover({
      coverKey,
      info,
      tokenName: 'POD',
      tokenSymbol: 'POD',
      supportsProducts: false,
      requiresWhitelist: false,
      stakeWithFee,
      initialReassuranceAmount,
      minStakeToReport,
      reportingPeriod,
      cooldownPeriod,
      claimPeriod,
      floor,
      ceiling,
      reassuranceRate,
      leverageFactor: '1'
    })
  })

  it('deployer added $4M to Bitmart cover pool', async () => {
    const initialLiquidity = helper.ether(4_000_000, PRECISION)
    const minStakeToReport = helper.ether(250)
    const vault = await composer.vault.getVault(contracts, coverKey)

    await contracts.dai.approve(vault.address, initialLiquidity)
    await contracts.npm.approve(vault.address, minStakeToReport)

    await vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })

    await network.provider.send('evm_increaseTime', [1 * DAYS])

    await contracts.dai.approve(vault.address, initialLiquidity)
    await contracts.npm.approve(vault.address, minStakeToReport)

    await vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
  })

  it('interest could not be accrued before withdrawal period', async () => {
    const vault = await composer.vault.getVault(contracts, coverKey)

    await vault.accrueInterest().should.be.rejectedWith('Withdrawal hasn\'t yet begun')
  })

  it('deployer can not remove liquidity without interest accrual', async () => {
    const [owner] = await ethers.getSigners()
    const toRedeem = helper.ether(3_000_000)
    const vault = await composer.vault.getVault(contracts, coverKey)

    await network.provider.send('evm_increaseTime', [181 * DAYS])

    await approve(vault.address, vault.address, owner)
    await vault.removeLiquidity(coverKey, toRedeem, '0', false).should.be.rejectedWith('Wait for accrual')
  })

  it('deployer removed $3M from Bitmart cover pool', async () => {
    const [owner] = await ethers.getSigners()
    const toRedeem = helper.ether(3_000_000)
    const vault = await composer.vault.getVault(contracts, coverKey)

    await vault.accrueInterest()

    await approve(vault.address, vault.address, owner)
    await vault.removeLiquidity(coverKey, toRedeem, '0', false)
  })
})
