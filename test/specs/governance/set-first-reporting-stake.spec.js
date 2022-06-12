/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Governance: `setFirstReportingStake` function', () => {
  const amount = '10000'
  const minReportingStake = helper.ether(250)
  let store,
    coverKey,
    deployed,
    governance,
    accessControlLibV1,
    baseLibV1,
    coverUtilV1,
    governanceUtilV1,
    transferLib,
    protoUtilV1,
    registryLibV1,
    storeKeyUtil,
    validationLibV1

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    store = deployed.store
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    coverUtilV1 = deployed.coverUtilV1
    governanceUtilV1 = deployed.governanceUtilV1
    transferLib = deployed.transferLib
    protoUtilV1 = deployed.protoUtilV1
    registryLibV1 = deployed.registryLibV1
    storeKeyUtil = deployed.storeKeyUtil
    validationLibV1 = deployed.validationLibV1

    governance = await deployer.deployWithLibraries(cache, 'Governance', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      CoverUtilV1: coverUtilV1.address,
      GovernanceUtilV1: governanceUtilV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    // await deployed.protocol.addContract(key.PROTOCOL.CNS.GOVERNANCE, governance.address)

    coverKey = key.toBytes32('foo-bar')
    const stakeWithFee = helper.ether(10_000)
    const initialReassuranceAmount = helper.ether(1_000_000)

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

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)
  })

  it('must set first reporting stake ', async () => {
    await deployed.governance.setFirstReportingStake(helper.emptyBytes32, amount)
    await deployed.governance.setFirstReportingStake(coverKey, minReportingStake)
  })

  it('must get first reporting stake ', async () => {
    const result = await governance.getFirstReportingStake(helper.emptyBytes32)
    result.should.equal(amount)
  })

  it('must get first reporting stake ', async () => {
    const result = await governance.getFirstReportingStake(coverKey)
    result.should.equal(minReportingStake)
  })

  it('reverts when zero is specified as minReportingStake', async () => {
    await deployed.governance.setFirstReportingStake(coverKey, '0').should.be.rejectedWith('Please specify value')
  })
})
