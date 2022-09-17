/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
const { ethers, network } = require('hardhat')
const composer = require('../../util/composer')
const { helper, cxToken, key, ipfs, sample } = require('../../util')
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const constants = {
  DAYS: 86400,
  HOURS: 3600,
  cxTokens: {},
  reportInfo: {
    title: 'Test Exploit',
    observed: new Date(),
    proofOfIncident: 'https://etherscan.io/tokenholdings?a=0xA9AD3537C819ae0530623aFb458Fee8456C47d33',
    description: 'Foobar',
    stake: '0'
  },
  coverAmounts: {
    attacker: 5000,
    alice: 500_000,
    bob: 20_000
  }
}

const coverKey = key.toBytes32('Compound Finance Cover')

/**
 * @type {Contracts}
 */
let contracts = {}

describe('Coverage Claim Stories', function () {
  this.timeout(40000)

  before(async () => {
    contracts = await composer.initializer.initialize(true)
    const [, attacker, alice, bob] = await ethers.getSigners()

    const info = await ipfs.write(sample.info)

    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const initialLiquidity = helper.ether(4_000_000, PRECISION)
    const stakeWithFee = helper.ether(10_000)
    const minStakeToReport = helper.ether(250)
    const reportingPeriod = 7 * constants.DAYS
    const cooldownPeriod = 1 * constants.DAYS
    const claimPeriod = 7 * constants.DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)
    const reassuranceRate = helper.percentage(50)

    if ((new Date()).getDate() > 22) {
      await network.provider.send('evm_increaseTime', [10 * constants.DAYS])
    }

    // Submit approvals
    await contracts.npm.approve(contracts.stakingContract.address, stakeWithFee)
    await contracts.reassuranceToken.approve(contracts.cover.address, initialReassuranceAmount)
    await contracts.dai.approve(contracts.cover.address, initialLiquidity)

    // Create a new cover
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

    // Add initial liquidity
    const vault = await composer.vault.getVault(contracts, coverKey)

    await contracts.dai.approve(vault.address, initialLiquidity)
    await contracts.npm.approve(vault.address, minStakeToReport)
    await vault.addLiquidity(coverKey, initialLiquidity, minStakeToReport, key.toBytes32(''))

    // Create Approvals
    await contracts.dai.connect(attacker).approve(contracts.policy.address, ethers.constants.MaxUint256)
    await contracts.dai.connect(alice).approve(contracts.policy.address, ethers.constants.MaxUint256)
    await contracts.dai.connect(bob).approve(contracts.policy.address, ethers.constants.MaxUint256)

    // Attacker purchases a cover

    const args = {
      onBehalfOf: attacker.address,
      coverKey,
      productKey: helper.emptyBytes32,
      coverDuration: '2',
      amountToCover: helper.ether(constants.coverAmounts.attacker, PRECISION),
      referralCode: key.toBytes32('')
    }

    ; (await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration)).cxToken.should.equal(helper.zerox)

    await contracts.policy.connect(attacker).purchaseCover(args)

    let at = (await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration)).cxToken
    constants.cxTokens.attacker = await cxToken.atAddress(at, contracts.libs)

    await network.provider.send('evm_increaseTime', [1 * constants.DAYS])

    // Alice purchases a cover
    args.onBehalfOf = alice.address
    args.amountToCover = helper.ether(constants.coverAmounts.alice, PRECISION)

    await contracts.policy.connect(alice).purchaseCover(args)

    at = (await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration)).cxToken
    constants.cxTokens.alice = await cxToken.atAddress(at, contracts.libs)

    await network.provider.send('evm_increaseTime', [1 * constants.DAYS])

    // Bob purchases a cover #1 (Valid)
    args.onBehalfOf = bob.address
    args.coverDuration = '3'
    args.amountToCover = helper.ether(constants.coverAmounts.bob, PRECISION)

    await contracts.policy.connect(bob).purchaseCover(args)

    at = (await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration)).cxToken
    constants.cxTokens.bob = await cxToken.atAddress(at, contracts.libs)

    await network.provider.send('evm_increaseTime', [1 * constants.DAYS])

    // Bob purchases a cover #2 (Invalid)
    await contracts.policy.connect(bob).purchaseCover(args)

    at = (await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration)).cxToken
    constants.cxTokens.bob = await cxToken.atAddress(at, contracts.libs)

    await network.provider.send('evm_increaseTime', [12 * constants.HOURS])

    // Bob purchases a cover #3 (Invalid)
    await contracts.policy.connect(bob).purchaseCover(args)

    at = (await contracts.policy.getCxToken(args.coverKey, args.productKey, args.coverDuration)).cxToken
    constants.cxTokens.bob = await cxToken.atAddress(at, contracts.libs)

    await network.provider.send('evm_increaseTime', [1 * constants.DAYS])
  })

  it('the cover incident was reported and is claimable', async () => {
    const [owner] = await ethers.getSigners()

    const info = await ipfs.write(constants.reportInfo)
    await contracts.npm.approve(contracts.governance.address, helper.ether(100_000))
    await contracts.governance.report(coverKey, helper.emptyBytes32, info, helper.ether(100_000))

    await contracts.protocol.grantRole(key.ACCESS_CONTROL.GOVERNANCE_ADMIN, owner.address)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    await network.provider.send('evm_increaseTime', [7 * constants.DAYS])

    await contracts.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

    await network.provider.send('evm_increaseTime', [1 * constants.DAYS])
  })

  it('alice successfully received payout during the claim period', async () => {
    const [, , alice] = await ethers.getSigners()

    const balance = await constants.cxTokens.alice.balanceOf(alice.address)
    constants.cxTokens.alice.connect(alice).approve(contracts.claimsProcessor.address, balance)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)
    await network.provider.send('evm_increaseTime', [1 * constants.DAYS])

    const before = await contracts.dai.balanceOf(alice.address)

    await contracts.claimsProcessor.connect(alice).claim(constants.cxTokens.alice.address, coverKey, helper.emptyBytes32, incidentDate, balance)
    const after = await contracts.dai.balanceOf(alice.address)

    parseInt(after.toString()).should.be.gt(parseInt(before.toString()))

    after.sub(before).toString().should.equal(helper.ether(constants.coverAmounts.alice * 0.935, PRECISION)) // 6.5% is platform fee
  })

  it('bob\'s payout was refused because of coverage lag', async () => {
    const [, ,, bob] = await ethers.getSigners()

    const balance = await constants.cxTokens.bob.balanceOf(bob.address)
    constants.cxTokens.bob.connect(bob).approve(contracts.claimsProcessor.address, balance)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    await contracts.claimsProcessor.connect(bob).claim(constants.cxTokens.bob.address, coverKey, helper.emptyBytes32, incidentDate, balance)
      .should.be.rejectedWith('Claim exceeds your coverage')
  })

  it('bob\'s partial claim was accepted', async () => {
    const [, ,, bob] = await ethers.getSigners()

    const claimAmount = helper.ether(100)
    constants.cxTokens.bob.connect(bob).approve(contracts.claimsProcessor.address, claimAmount)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    await contracts.claimsProcessor.connect(bob).claim(constants.cxTokens.bob.address, coverKey, helper.emptyBytes32, incidentDate, claimAmount)
  })

  it('the attacker was blacklisted', async () => {
    const [, attacker] = await ethers.getSigners()
    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    await contracts.claimsProcessor.setBlacklist(coverKey, helper.emptyBytes32, incidentDate, [attacker.address], [true])
  })

  it('the attacker was unable to claim their coverage', async () => {
    const [, attacker] = await ethers.getSigners()

    const balance = await constants.cxTokens.bob.balanceOf(attacker.address)
    constants.cxTokens.attacker.connect(attacker).approve(contracts.claimsProcessor.address, balance)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

    await contracts.claimsProcessor.connect(attacker).claim(constants.cxTokens.attacker.address, coverKey, helper.emptyBytes32, incidentDate, balance)
      .should.be.rejectedWith('Access denied')
  })
})
