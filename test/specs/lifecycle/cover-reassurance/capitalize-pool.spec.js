/* eslint-disable no-unused-expressions */
const moment = require('moment')
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const cxTokenUtil = require('../../../../util/cxToken')
const { deployDependencies } = require('./deps')
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('CoverReassurance: capitalizePool', () => {
  let deployed, coverKey

  async function reportAndClaim(executeBefore = "") {
    const [owner, bob, alice] = await ethers.getSigners()
    const amountToCover = helper.ether(100_000)
    let incidentDate = "0";
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))

    await deployed.dai.approve(deployed.policy.address, ethers.constants.MaxUint256)

    if(executeBefore !== "purchase") {
      await deployed.policy.purchaseCover(owner.address, coverKey, helper.emptyBytes32, '1', amountToCover, key.toBytes32(''))
      const at = (await deployed.policy.getCxToken(coverKey, helper.emptyBytes32, '1')).cxToken
      const cxToken = await cxTokenUtil.atAddress(at, {
        accessControlLibV1: deployed.accessControlLibV1,
        baseLibV1: deployed.baseLibV1,
        governanceUtilV1: deployed.governanceUtilV1,
        policyHelperV1: deployed.policyHelperV1,
        protoUtilV1: deployed.protoUtilV1,
        validationLibV1: deployed.validationLibV1
      })

      const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      const tomorrowEOD = moment((block.timestamp + 1 * DAYS) * 1000).utc().endOf('day').unix()
      const coverageLagPeriod = tomorrowEOD - block.timestamp

      // Coverage lag + 1 second
      await network.provider.send('evm_increaseTime', [coverageLagPeriod])
      await network.provider.send('evm_increaseTime', [1])

      if(executeBefore !== 'report') {
        await deployed.governance.report(coverKey, helper.emptyBytes32, reportingInfo, helper.ether(1000))
        incidentDate = await deployed.governance.getActiveIncidentDate(coverKey, helper.emptyBytes32)

        // Reporting period + 1 second
        await network.provider.send('evm_increaseTime', [7 * DAYS])
        await network.provider.send('evm_increaseTime', [1])

        if(executeBefore !== "resolve") {
          await deployed.resolution.resolve(coverKey, helper.emptyBytes32, incidentDate)

          // Cooldown period + 1 second
          await network.provider.send('evm_increaseTime', [1 * DAYS])
          await network.provider.send('evm_increaseTime', [1])

          await cxToken.approve(deployed.claimsProcessor.address, amountToCover)

          if(executeBefore !== "claim") {
            await deployed.claimsProcessor.claim(cxToken.address, coverKey, helper.emptyBytes32, incidentDate, amountToCover)

            if(executeBefore !== "claimExpire") {
              // Claim period + 1 second
              await network.provider.send('evm_increaseTime', [7 * DAYS])
              await network.provider.send('evm_increaseTime', [1])
            }
          }
        }
      }
    }

    return {owner, amountToCover, reportingInfo, incidentDate, bob, alice};
  }

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const stakeWithFee = helper.ether(10_000)
    const initialReassuranceAmount = helper.ether(1_000_000)
    const initialLiquidity = helper.ether(4_000_000)
    const minReportingStake = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)
    const reassuranceRate = helper.percentage(50)
    const leverage = '1'

    const requiresWhitelist = false
    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, false, info, deployed.dai.address, requiresWhitelist, values)
    await deployed.cover.deployVault(coverKey)

    deployed.vault = await composer.vault.getVault({
      store: deployed.store,
      libs: {
        accessControlLibV1: deployed.accessControlLibV1,
        baseLibV1: deployed.baseLibV1,
        transferLib: deployed.transferLib,
        protoUtilV1: deployed.protoUtilV1,
        registryLibV1: deployed.registryLibV1,
        validationLibV1: deployed.validationLibV1
      }
    }, coverKey)

    await deployed.dai.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minReportingStake)
    await deployed.vault.addLiquidity(coverKey, initialLiquidity, minReportingStake, key.toBytes32(''))
  })

  it('correctly capitalizes pool', async () => {
    const { incidentDate } = await reportAndClaim();    

    const tx = await deployed.reassuranceContract.capitalizePool(coverKey, helper.emptyBytes32, incidentDate)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'PoolCapitalized')

    event.args.coverKey.should.equal(coverKey)
    event.args.incidentDate.should.equal(incidentDate)
    event.args.productKey.should.equal(helper.emptyBytes32)
    event.args.amount.should.equal(helper.ether(50_000)) // based on reassuranceRate defined above

    await deployed.resolution.finalize(coverKey, helper.emptyBytes32, incidentDate)
  })

  it('revert on protocol pause', async () => {
      const { incidentDate } = await reportAndClaim();

      await deployed.protocol.pause();

      const tx = await deployed.reassuranceContract.capitalizePool(coverKey, helper.emptyBytes32, incidentDate).should.be.rejectedWith('Protocol is paused')
  })

  it('revert on insufficient access', async () => {
    const { incidentDate, bob } = await reportAndClaim();

    await deployed.reassuranceContract.connect(bob).capitalizePool(coverKey, helper.emptyBytes32, incidentDate).should.be.rejectedWith('Forbidden')
  })

  it('revert on invalid product key', async () => {
    const productKey = key.toBytes32('invalid')
    const { incidentDate } = await reportAndClaim();

    await deployed.reassuranceContract.capitalizePool(coverKey, productKey, incidentDate).should.be.rejectedWith('Invalid product')
  })

  it("revert on invalid incident date", async () => {
    const { incidentDate } = await reportAndClaim();
    const invalidDate = (incidentDate + 24 * 60 * 60).toString();

    await deployed.reassuranceContract.capitalizePool(coverKey, helper.emptyBytes32, invalidDate).should.be.rejectedWith('Invalid incident date')
  })

  it("revert on before resolution date", async () => {
    const { incidentDate } = await reportAndClaim(executeBefore="resolve");

    await deployed.reassuranceContract.capitalizePool(coverKey, helper.emptyBytes32, incidentDate).should.be.rejectedWith('Still unresolved')
  })

  it("revert if claim not expired", async () => {
    const { incidentDate } = await reportAndClaim(executeBefore="claimExpire");
    
    await deployed.reassuranceContract.capitalizePool(coverKey, helper.emptyBytes32, incidentDate).should.be.rejectedWith('Claim still active')
  })

})
