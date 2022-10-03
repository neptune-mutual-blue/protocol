/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, key, ipfs, sample } = require('../../util')
const composer = require('../../util/composer')
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

describe('Policy Purchase Stories', () => {
  before(async () => {
    contracts = await composer.initializer.initialize(true)
  })

  it('a new cover `Compound Finance Cover` was created', async () => {
    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const initialLiquidity = helper.ether(4_000_000, PRECISION)
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

    const vault = await composer.vault.getVault(contracts, coverKey)

    await contracts.dai.approve(vault.address, initialLiquidity)
    await contracts.npm.approve(vault.address, minStakeToReport)
    await vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
  })

  it('cover pool summary values are accurate', async () => {
    const result = await contracts.policy.getCoverPoolSummary(coverKey, helper.emptyBytes32)
    const [totalAmountInPool, totalCommitment, reassurance, reassuranceWeight, count, leverage, efficiency] = result

    totalAmountInPool.toString().should.equal(helper.ether(4_000_000, PRECISION))
    totalCommitment.toString().should.equal('0')
    reassurance.toString().should.equal(helper.ether(1_000_000, PRECISION))
    reassuranceWeight.toString().should.equal(helper.percentage(100))
    count.toString().should.equal('0')
    leverage.toString().should.equal('1')
    efficiency.toString().should.equal('0')
  })

  it('let\'s purchase a policy for `Compound Finance Cover`', async () => {
    const [owner] = await ethers.getSigners()

    const args = {
      onBehalfOf: owner.address,
      coverKey,
      productKey: helper.emptyBytes32,
      coverDuration: '2',
      amountToCover: helper.ether(2_500_000, PRECISION),
      referralCode: key.toBytes32('')
    }

    const { fee } = await contracts.policy.getCoverFeeInfo(args.coverKey, args.productKey, args.coverDuration, args.amountToCover)

   ;(await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration))[0].should.equal(helper.zerox)

    await contracts.dai.approve(contracts.policy.address, fee)
    await contracts.policy.purchaseCover(args)

    const { cxToken: cxTokenAddress } = await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration)
    const cxToken = await composer.token.at(cxTokenAddress)

    const cxDaiBalance = await cxToken.balanceOf(owner.address)

    cxDaiBalance.toString().should.equal(helper.ether(2_500_000))
  })

  it('let\'s purchase a policy for `Compound Finance Cover` again', async () => {
    const [owner] = await ethers.getSigners()

    const args = {
      onBehalfOf: owner.address,
      coverKey,
      productKey: helper.emptyBytes32,
      coverDuration: '2',
      amountToCover: helper.ether(500_000, PRECISION),
      referralCode: key.toBytes32('')
    }

    const { fee } = await contracts.policy.getCoverFeeInfo(args.coverKey, args.productKey, args.coverDuration, args.amountToCover)

   ;(await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration))[0].should.not.equal(helper.zerox)

    await contracts.dai.approve(contracts.policy.address, fee)

    await contracts.policy.purchaseCover(args)

    const { cxToken: cxTokenAddress } = await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration)
    const cxToken = await composer.token.at(cxTokenAddress)

    const cxDaiBalance = await cxToken.balanceOf(owner.address)

    cxDaiBalance.toString().should.equal(helper.ether(3_000_000))
  })
})
