/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, key, ipfs, sample } = require('../../util')
const composer = require('../../util/composer')

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

describe('Policy Purchase Stories', () => {
  before(async () => {
    contracts = await composer.initializer.initialize(true)
  })

  it('a new cover `Compound Finance Cover` was created', async () => {
    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const stakeWithFee = helper.ether(10_000)
    const initialReassuranceAmount = helper.ether(1_000_000)
    const initialLiquidity = helper.ether(24_000_000)
    const minReportingStake = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)

    await contracts.npm.approve(contracts.stakingContract.address, stakeWithFee)
    await contracts.reassuranceToken.approve(contracts.reassuranceContract.address, initialReassuranceAmount)

    const requiresWhitelist = false
    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling]
    await contracts.cover.addCover(coverKey, info, contracts.reassuranceToken.address, requiresWhitelist, values)
    await contracts.cover.deployVault(coverKey)

    const vault = await composer.vault.getVault(contracts, coverKey)

    await contracts.dai.approve(vault.address, initialLiquidity)
    await contracts.npm.approve(vault.address, minReportingStake)
    await vault.addLiquidity(coverKey, initialLiquidity, minReportingStake)
  })

  it('provision of 1M NPM tokens was added to the `Compound Finance Cover` pool', async () => {
    const [owner] = await ethers.getSigners()
    const provision = helper.ether(1_000_001)

    await contracts.npm.approve(contracts.provisionContract.address, provision)

    await contracts.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, owner.address)
    await contracts.provisionContract.increaseProvision(coverKey, provision)

    await contracts.provisionContract.decreaseProvision(coverKey, helper.ether(1))

    const existing = await contracts.provisionContract.getProvision(coverKey)
    existing.toString().should.equal(helper.ether(1_000_000))
  })

  it('cover pool summary values are accurate', async () => {
    const result = await contracts.policy.getCoverPoolSummary(coverKey)
    const [totalAmountInPool, totalCommitment, provision, npmPrice, reassurance, reassurancePrice, reassuranceWeight] = result

    totalAmountInPool.toString().should.equal(helper.ether(24_000_000))
    totalCommitment.toString().should.equal(helper.ether(0))
    provision.toString().should.equal(helper.ether(1_000_000))
    npmPrice.toString().should.equal(helper.ether(2))
    reassurance.toString().should.equal(helper.ether(1_000_000))
    reassurancePrice.toString().should.equal(helper.ether(1))
    reassuranceWeight.toString().should.equal(helper.percentage(100))
  })

  it('let\'s purchase a policy for `Compound Finance Cover`', async () => {
    const args = [coverKey, 2, helper.ether(2_500_000)]
    const { fee } = await contracts.policy.getCoverFeeInfo(...args)

   ;(await contracts.policy.getCxToken(args[0], args[1]))[0].should.equal(helper.zerox)

    await contracts.dai.approve(contracts.policy.address, fee)
    await contracts.policy.purchaseCover(...args)

    const { cxToken: cxTokenAddress } = await contracts.policy.getCxToken(args[0], args[1])
    const cxToken = await composer.token.at(cxTokenAddress)

    const [owner] = await ethers.getSigners()
    const cxDaiBalance = await cxToken.balanceOf(owner.address)

    cxDaiBalance.toString().should.equal(args[2].toString())
  })

  it('fee should be ~85.67 DAI when purchasing 10K DAI cover for 1 month', async () => {
    const result = await contracts.policy.getCoverFeeInfo(coverKey, 1, helper.ether(10_000))
    const { fee } = result

    helper.weiToEther(fee).toFixed(2).should.equal('85.67')
  })

  it('fee should be ~$8225 when purchasing 250K DAI cover for 3 months', async () => {
    const result = await contracts.policy.getCoverFeeInfo(coverKey, 3, helper.ether(250_000))
    const { fee } = result

    helper.weiToEther(fee).toFixed(2).should.equal('8225.00')
  })

  it('fee should be ~5037.50 when purchasing 500K DAI cover for 1 month', async () => {
    const result = await contracts.policy.getCoverFeeInfo(coverKey, 1, helper.ether(500_000))
    const { fee } = result

    helper.weiToEther(fee).toFixed(2).should.equal('5037.50')
  })

  it('fee should be ~$10908.33 when purchasing 500K DAI cover for 2 months', async () => {
    const result = await contracts.policy.getCoverFeeInfo(coverKey, 2, helper.ether(500_000))
    const { fee } = result

    helper.weiToEther(fee).toFixed(2).should.equal('10908.33')
  })

  it('let\'s purchase a policy for `Compound Finance Cover` again', async () => {
    const args = [coverKey, 2, helper.ether(500_000)]
    const { fee } = await contracts.policy.getCoverFeeInfo(...args)

   ;(await contracts.policy.getCxToken(args[0], args[1]))[0].should.not.equal(helper.zerox)

    await contracts.dai.approve(contracts.policy.address, fee)
    await contracts.policy.purchaseCover(...args)

    const { cxToken: cxTokenAddress } = await contracts.policy.getCxToken(args[0], args[1])
    const cxToken = await composer.token.at(cxTokenAddress)

    const [owner] = await ethers.getSigners()
    const cxDaiBalance = await cxToken.balanceOf(owner.address)

    cxDaiBalance.toString().should.equal(helper.ether(3_000_000))
  })
})
