/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
const { ethers, network } = require('hardhat')
const composer = require('../util/composer')
const { helper, cxToken, key, ipfs, sample } = require('../util')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const constants = {
  DAYS: 86400,
  cxTokens: {},
  reportInfo: {
    title: 'Test Exploit',
    observed: new Date(),
    proofOfIncident: 'https://etherscan.io/tokenholdings?a=0xA9AD3537C819ae0530623aFb458Fee8456C47d33',
    description: 'Foobar',
    stake: '0'
  },
  coverAmounts: {
    kimberly: 500_000,
    lewis: 20_000
  },
  stakes: {
    yes: {
      reporting: 250,
      contributions: {
        chris: [101, 200],
        emily: [400],
        george: [6000, 200],
        isabel: [300]
      }
    },
    no: {
      reporting: 251,
      contributions: {
        bob: [100, 200],
        david: [20000],
        franklin: [10, 200],
        henry: [3000],
        john: [300, 200]
      }
    }
  }
}

const sumOf = (x) => helper.ether(x.reporting + Object.values(x.contributions).flat().reduce((y, z) => y + z))

const coverKey = key.toBytes32('Compound Finance Cover')

/**
 * @type {Contracts}
 */
let contracts = {}

const attest = async (id, user, stake) => {
  await contracts.npm.connect(user).approve(contracts.governance.address, helper.ether(stake))
  await contracts.governance.connect(user).attest(coverKey, id, helper.ether(stake))
}

const refute = async (id, user, stake) => {
  await contracts.npm.connect(user).approve(contracts.governance.address, helper.ether(stake))
  await contracts.governance.connect(user).refute(coverKey, id, helper.ether(stake))
}

describe('Governance Stories', () => {
  before(async () => {
    contracts = await composer.initializer.initialize(true)
    const [_o, _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, kimberly, lewis] = await ethers.getSigners() // eslint-disable-line

    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const stakeWithFee = helper.ether(10_000)
    const initialReassuranceAmount = helper.ether(1_000_000)
    const initialLiquidity = helper.ether(4_000_000)
    const minReportingStake = helper.ether(250)
    const reportingPeriod = 7 * constants.DAYS

    // Submit approvals
    await contracts.npm.approve(contracts.stakingContract.address, stakeWithFee)
    await contracts.reassuranceToken.approve(contracts.reassuranceContract.address, initialReassuranceAmount)
    await contracts.dai.approve(contracts.cover.address, initialLiquidity)

    // Create a new cover
    await contracts.cover.addCover(coverKey, info, contracts.reassuranceToken.address, [minReportingStake, reportingPeriod, stakeWithFee, initialReassuranceAmount, initialLiquidity])

    // Add provision
    const provision = helper.ether(1_000_001)

    await contracts.npm.approve(contracts.provisionContract.address, provision)

    await contracts.protocol.grantRole(key.ACCESS_CONTROL.LIQUIDITY_MANAGER, _o.address)
    await contracts.provisionContract.increaseProvision(coverKey, provision)

    // Purchase a cover
    let args = [coverKey, 2, helper.ether(constants.coverAmounts.kimberly)]
    let fee = (await contracts.policy.getCoverFeeInfo(...args)).fee

      ; (await contracts.policy.getCxToken(args[0], args[1])).cxToken.should.equal(helper.zerox)

    await contracts.dai.connect(kimberly).approve(contracts.policy.address, fee)
    await contracts.policy.connect(kimberly).purchaseCover(...args)

    let at = (await contracts.policy.getCxToken(args[0], args[1])).cxToken
    constants.cxTokens.kimberly = await cxToken.atAddress(at, contracts.libs)

    // Purchase a cover
    args = [coverKey, 3, helper.ether(constants.coverAmounts.lewis)]
    fee = (await contracts.policy.getCoverFeeInfo(...args)).fee

    await contracts.dai.connect(lewis).approve(contracts.policy.address, fee)
    await contracts.policy.connect(lewis).purchaseCover(...args)

    at = (await contracts.policy.getCxToken(args[0], args[1])).cxToken
    constants.cxTokens.lewis = await cxToken.atAddress(at, contracts.libs)
  })

  it('can not claim until an incident occurs', async () => {
    const [, , , , , , , , , , , , lewis] = await ethers.getSigners() // eslint-disable-line

    const balance = await constants.cxTokens.lewis.balanceOf(lewis.address)
    constants.cxTokens.lewis.connect(lewis).approve(contracts.claimsProcessor.address, balance)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await contracts.claimsProcessor.connect(lewis).claim(constants.cxTokens.kimberly.address, coverKey, incidentDate, balance)
      .should.be.rejectedWith('Not claimable')
  })

  it('the cover `Compound Finance` has no known incidents', async () => {
    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)
    incidentDate.toNumber().should.equal(0)

    const status = await contracts.governance.getStatus(coverKey)
    status.toNumber().should.equal(helper.coverStatus.normal)
  })

  it('alice submitted an incident with 250 stake', async () => {
    const [_, alice] = await ethers.getSigners() // eslint-disable-line

    const stake = helper.ether(constants.stakes.yes.reporting)
    const info = await ipfs.write(constants.reportInfo)

    const previous = await contracts.npm.balanceOf(alice.address)

    await contracts.npm.connect(alice).approve(contracts.governance.address, stake)
    await contracts.governance.connect(alice).report(coverKey, info, helper.ether(1))
      .should.be.rejectedWith('Stake insufficient')

    await contracts.governance.connect(alice).report(coverKey, info, stake)

    const current = await contracts.npm.balanceOf(alice.address)
    previous.sub(current).toString().should.equal(stake)
  })

  it('no reporter should be accepted other than alice', async () => {
    const [, , bob] = await ethers.getSigners() // eslint-disable-line

    const stake = helper.ether(constants.stakes.yes.reporting)
    const info = await ipfs.write(constants.reportInfo)

    await contracts.npm.connect(bob).approve(contracts.governance.address, stake)
    await contracts.governance.connect(bob).report(coverKey, info, stake)
      .should.be.rejectedWith('Actively Reporting')
  })

  it('the cover is now reporting and has an incident date', async () => {
    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)
    incidentDate.toNumber().should.be.greaterThan(0)

    const status = await contracts.governance.getStatus(coverKey)
    status.toNumber().should.equal(helper.coverStatus.incidentHappened)
  })

  it('alice is the reporter', async () => {
    const [, alice] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)
    const reporter = await contracts.governance.getReporter(coverKey, incidentDate)

    reporter.should.equal(alice.address)
  })

  it('bob disputed the current incident with 250 stake', async () => {
    const [, , bob] = await ethers.getSigners() // eslint-disable-line
    const stake = helper.ether(constants.stakes.no.reporting)
    const info = await ipfs.write(constants.reportInfo)
    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await contracts.npm.connect(bob).approve(contracts.governance.address, stake)

    await contracts.governance.connect(bob).dispute(coverKey, incidentDate, info, helper.ether(1))
      .should.be.rejectedWith('Stake insufficient')

    await contracts.governance.connect(bob).dispute(coverKey, incidentDate, info, stake)
  })

  it('no disputer is accepted other than bob', async () => {
    const [, , , chris] = await ethers.getSigners() // eslint-disable-line
    const stake = helper.ether(constants.stakes.no.reporting)
    const info = await ipfs.write(constants.reportInfo)
    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await contracts.npm.connect(chris).approve(contracts.governance.address, stake)
    await contracts.governance.connect(chris).dispute(coverKey, incidentDate, info, stake)
      .should.be.rejectedWith('Already disputed')
  })

  it('bob became the new reporter', async () => {
    const [, , bob] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)
    const reporter = await contracts.governance.getReporter(coverKey, incidentDate)

    reporter.should.equal(bob.address)

    const status = await contracts.governance.getStatus(coverKey)
    status.toNumber().should.equal(helper.coverStatus.falseReporting)
  })

  it('david, franklin, and john refuted the incident reporting', async () => {
    const [, , , , david, , franklin, , , , john] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await refute(incidentDate, david, constants.stakes.no.contributions.david[0])
    await refute(incidentDate, franklin, constants.stakes.no.contributions.franklin[0])
    await refute(incidentDate, john, constants.stakes.no.contributions.john[0])
  })

  it('chris, isabel, and george attested the incident reporting', async () => {
    const [, , , chris, , , , george, , isabel] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await attest(incidentDate, chris, constants.stakes.yes.contributions.chris[0])
    await attest(incidentDate, isabel, constants.stakes.yes.contributions.isabel[0])
    await attest(incidentDate, george, constants.stakes.yes.contributions.george[0])
  })

  it('bob, franklin, and john refuted the incident reporting', async () => {
    const [, , bob, , , , franklin, , , , john] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await refute(incidentDate, bob, constants.stakes.no.contributions.bob[0])
    await refute(incidentDate, franklin, constants.stakes.no.contributions.franklin[1])
    await refute(incidentDate, john, constants.stakes.no.contributions.john[1])
  })

  it('emily and chris attested the incident reporting', async () => {
    const [, , , chris, , emily] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await attest(incidentDate, emily, constants.stakes.yes.contributions.emily[0])
    await attest(incidentDate, chris, constants.stakes.yes.contributions.chris[1])
  })

  it('bob and henry refuted the incident reporting', async () => {
    const [, , bob, , , , , , henry] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await refute(incidentDate, bob, constants.stakes.no.contributions.bob[1])
    await refute(incidentDate, henry, constants.stakes.no.contributions.henry[0])
  })

  it('george attested the incident reporting', async () => {
    const [, , , , , , , george] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await attest(incidentDate, george, constants.stakes.yes.contributions.george[1])
  })

  it('the stakes are correctly set', async () => {
    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)
    const [yes, no] = await contracts.governance.getStakes(coverKey, incidentDate)

    yes.toString().should.equal(sumOf(constants.stakes.yes))
    no.toString().should.equal(sumOf(constants.stakes.no))
  })

  it('individual stakes are also correct', async () => {
    const [, , bob, chris, david, emily, franklin, george, harry, isabel, john] = await ethers.getSigners() // eslint-disable-line
    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    const ensureStake = async (account, y, n) => {
      const [yes, no] = await contracts.governance.getStakesOf(coverKey, incidentDate, account.address)

      y && yes.toString().should.equal(y)
      n && no.toString().should.equal(n)
    }

    const sum = helper.sum

    await ensureStake(bob, 0, helper.ether(constants.stakes.no.reporting + sum(constants.stakes.no.contributions.bob)))
    await ensureStake(chris, helper.ether(sum(constants.stakes.yes.contributions.chris)))
    await ensureStake(david, 0, helper.ether(sum(constants.stakes.no.contributions.david)))
    await ensureStake(emily, helper.ether(sum(constants.stakes.yes.contributions.emily)))
    await ensureStake(franklin, 0, helper.ether(sum(constants.stakes.no.contributions.franklin)))
    await ensureStake(george, helper.ether(sum(constants.stakes.yes.contributions.george)))
    await ensureStake(harry, 0, helper.ether(sum(constants.stakes.no.contributions.henry)))
    await ensureStake(isabel, helper.ether(sum(constants.stakes.yes.contributions.isabel)))
    await ensureStake(john, 0, helper.ether(sum(constants.stakes.no.contributions.john)))
  })

  it('unable to claim because the incident is disputed (majority disagree)', async () => {
    const [, , , , , , , , , , , kimberly] = await ethers.getSigners() // eslint-disable-line

    const balance = await constants.cxTokens.kimberly.balanceOf(kimberly.address)
    constants.cxTokens.kimberly.connect(kimberly).approve(contracts.claimsProcessor.address, balance)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await contracts.claimsProcessor.connect(kimberly).claim(constants.cxTokens.kimberly.address, coverKey, incidentDate, balance)
      .should.be.rejectedWith('Not claimable')
  })

  it('george again attested with a very large stake', async () => {
    const [, , , , , , , george] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await attest(incidentDate, george, 100_000)
  })

  it('unable to claim because the claim period has not begun', async () => {
    const [, , , , , , , , , , , kimberly] = await ethers.getSigners() // eslint-disable-line

    const balance = await constants.cxTokens.kimberly.balanceOf(kimberly.address)
    constants.cxTokens.kimberly.connect(kimberly).approve(contracts.claimsProcessor.address, balance)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await contracts.claimsProcessor.connect(kimberly).claim(constants.cxTokens.kimberly.address, coverKey, incidentDate, balance)
      .should.be.rejectedWith('Not claimable')
  })

  it('a governance agent resolves the cover', async () => {
    const [owner, alex] = await ethers.getSigners() // eslint-disable-line

    await contracts.protocol.grantRole(key.ACCESS_CONTROL.GOVERNANCE_ADMIN, owner.address)
    await contracts.protocol.grantRole(key.ACCESS_CONTROL.GOVERNANCE_AGENT, alex.address)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await network.provider.send('evm_increaseTime', [7 * constants.DAYS])

    await contracts.resolution.connect(alex).resolve(coverKey, incidentDate)

    const status = await contracts.governance.getStatus(coverKey)
    status.toNumber().should.equal(helper.coverStatus.claimable)
  })

  it('kimberly successfully received payout during the claim period', async () => {
    const [, , , , , , , , , , , kimberly] = await ethers.getSigners() // eslint-disable-line

    const balance = await constants.cxTokens.kimberly.balanceOf(kimberly.address)
    constants.cxTokens.kimberly.connect(kimberly).approve(contracts.claimsProcessor.address, balance)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)
    await network.provider.send('evm_increaseTime', [1 * constants.DAYS])

    const before = await contracts.dai.balanceOf(kimberly.address)

    await contracts.claimsProcessor.connect(kimberly).claim(constants.cxTokens.kimberly.address, coverKey, incidentDate, balance)
    const after = await contracts.dai.balanceOf(kimberly.address)

    parseInt(after.toString()).should.be.gt(parseInt(before.toString()))

    after.sub(before).toString().should.equal(helper.ether(constants.coverAmounts.kimberly * 0.935)) // 6.5% is platform fee
  })

  it('lewis was unable to claim after the expiry period', async () => {
    const [, , , , , , , , , , , , lewis] = await ethers.getSigners() // eslint-disable-line

    const balance = await constants.cxTokens.lewis.balanceOf(lewis.address)
    constants.cxTokens.lewis.connect(lewis).approve(contracts.claimsProcessor.address, balance)

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    // This causes the claim period to expire
    await network.provider.send('evm_increaseTime', [7 * constants.DAYS])

    await contracts.claimsProcessor.connect(lewis).claim(constants.cxTokens.lewis.address, coverKey, incidentDate, balance)
      .should.be.rejectedWith('Claim period has expired')
  })

  it('a governance agent finalizes the cover', async () => {
    const [, alex] = await ethers.getSigners() // eslint-disable-line

    const incidentDate = await contracts.governance.getActiveIncidentDate(coverKey)

    await network.provider.send('evm_increaseTime', [7 * constants.DAYS])

    await contracts.resolution.connect(alex).finalize(coverKey, incidentDate)

    const status = await contracts.governance.getStatus(coverKey)
    status.toNumber().should.equal(helper.coverStatus.normal)
  })
})
