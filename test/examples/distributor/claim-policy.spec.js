/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, helper, key } = require('../../../util')
const erc20 = require('../../../util/contract-helper/erc20')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Distributor: `claimPolicy` function', () => {
  let deployed, treasury, feePercentage, distributor, cxToken, incidentDate

  beforeEach(async () => {
    deployed = await deployDependencies()

    treasury = helper.randomAddress()
    feePercentage = helper.percentage(20)

    distributor = await deployer.deploy(cache, 'NPMDistributor', deployed.store.address, treasury, feePercentage)

    const duration = '2'
    const protection = helper.ether(10_000)
    const referralCode = key.toBytes32('referral-code')

    await deployed.dai.approve(distributor.address, ethers.constants.MaxUint256)
    const tx = await distributor.purchasePolicy(deployed.coverKey, duration, protection, referralCode)
    const { events } = await tx.wait()

    cxToken = events.find(x => x.event === 'PolicySold').args.cxToken

    const coverKey = deployed.coverKey

    // Report this cover
    const reportingInfo = key.toBytes32('reporting-info')
    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))
    await deployed.governance.report(coverKey, reportingInfo, helper.ether(1000))

    // Reporting period + 1 second
    await network.provider.send('evm_increaseTime', [7 * DAYS])
    await network.provider.send('evm_increaseTime', [1])

    // Resolve this cover
    incidentDate = await deployed.governance.getActiveIncidentDate(coverKey)
    await deployed.resolution.resolve(coverKey, incidentDate)

    // Cooldown period + 1 second
    await network.provider.send('evm_increaseTime', [1 * DAYS])
    await network.provider.send('evm_increaseTime', [1])
  })

  it('must correctly claim a cxToken', async () => {
    const [owner] = await ethers.getSigners()

    // Claim the cxTokens
    await erc20.approve(cxToken, distributor.address, owner)
    const tx = await distributor.claimPolicy(cxToken, deployed.coverKey, incidentDate, helper.ether(10_000))

    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'PolicyClaimed')

    event.args.cxToken.should.equal(cxToken)
    event.args.coverKey.should.equal(deployed.coverKey)
    event.args.incidentDate.should.equal(incidentDate)
    event.args.amount.should.equal(helper.ether(10_000))
    event.args.payout.should.equal(helper.ether(9350))
  })

  it('must reject if cxToken is a zero address', async () => {
    await distributor.claimPolicy(helper.zerox, deployed.coverKey, incidentDate, helper.ether(10_000))
      .should.be.rejectedWith('Invalid cxToken')
  })

  it('must reject if cover key is 0', async () => {
    const [owner] = await ethers.getSigners()

    // Claim the cxTokens
    await erc20.approve(cxToken, distributor.address, owner)
    await distributor.claimPolicy(cxToken, key.toBytes32(''), incidentDate, helper.ether(10_000))
      .should.be.rejectedWith('Invalid key')
  })

  it('must reject if incident date is 0', async () => {
    const [owner] = await ethers.getSigners()

    // Claim the cxTokens
    await erc20.approve(cxToken, distributor.address, owner)
    await distributor.claimPolicy(cxToken, deployed.coverKey, '0', helper.ether(10_000))
      .should.be.rejectedWith('Invalid incident date')
  })

  it('must reject if amount is 0', async () => {
    const [owner] = await ethers.getSigners()

    // Claim the cxTokens
    await erc20.approve(cxToken, distributor.address, owner)
    await distributor.claimPolicy(cxToken, deployed.coverKey, incidentDate, '0')
      .should.be.rejectedWith('Invalid amount')
  })

  it('must reject if processor is missing', async () => {
    const [owner] = await ethers.getSigners()

    const storeKey = key.qualifyBytes32(key.toBytes32('cns:claim:processor'))
    await deployed.store.deleteAddress(storeKey)

    // Claim the cxTokens
    await erc20.approve(cxToken, distributor.address, owner)
    await distributor.claimPolicy(cxToken, deployed.coverKey, incidentDate, helper.ether(10_000))
      .should.be.rejectedWith('Fatal: Processor missing')

    await deployed.store.setAddress(storeKey, deployed.processor.address)
  })

  it('must reject if DAI is missing', async () => {
    const [owner] = await ethers.getSigners()

    const storeKey = key.toBytes32('cns:cover:sc')
    await deployed.store.deleteAddress(storeKey)

    // Claim the cxTokens
    await erc20.approve(cxToken, distributor.address, owner)
    await distributor.claimPolicy(cxToken, deployed.coverKey, incidentDate, helper.ether(10_000))
      .should.be.rejectedWith('Fatal: DAI missing')

    await deployed.store.setAddress(storeKey, deployed.dai.address)
  })
})
