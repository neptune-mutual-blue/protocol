/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const composer = require('../../../util/composer')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('CoverUtilV1: getActiveLiquidityUnderProtection', () => {
  let deployed, mockContract, coverKey, mockStoreUser

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
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

    const requiresWhitelist = false
    const values = [stakeWithFee, initialReassuranceAmount, minReportingStake, reportingPeriod, cooldownPeriod, claimPeriod, floor, ceiling, reassuranceRate, leverage]

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist(owner.address, true)

    await deployed.npm.approve(deployed.stakingContract.address, stakeWithFee)
    await deployed.dai.approve(deployed.reassuranceContract.address, initialReassuranceAmount)

    await deployed.cover.addCover(coverKey, info, 'POD', 'POD', false, requiresWhitelist, values)

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

    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockCoverUtilUser',
      {
        CoverUtilV1: deployed.coverUtilV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address
      },
      deployed.store.address
    )

    mockStoreUser = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockStoreUser.address), true)
  })

  it('must return zero when active incident is zero', async () => {
    const activeIncidentDate = await mockStoreUser['getUintByKeys(bytes32,bytes32)'](key.PROTOCOL.NS.GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey)
    activeIncidentDate.should.equal('0')

    const result = await mockContract.getActiveLiquidityUnderProtection(coverKey, helper.emptyBytes32)
    result.should.equal('0')
  })

  it('must return zero when active incident is greater than zero and no policies purchased', async () => {
    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    const activeIncidentDate = block.timestamp

    const previous = await mockStoreUser['getUintByKeys(bytes32,bytes32)'](key.PROTOCOL.NS.GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey)
    await mockStoreUser['setUintByKeys(bytes32,bytes32,uint256)'](key.PROTOCOL.NS.GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, activeIncidentDate)

    const result = await mockContract.getActiveLiquidityUnderProtection(coverKey, helper.emptyBytes32)
    result.should.equal('0')

    await mockStoreUser['setUintByKeys(bytes32,bytes32,uint256)'](key.PROTOCOL.NS.GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, previous)
  })

  it('must not return zero when active incident is greater than zero and policies purchased', async () => {
    const [owner] = await ethers.getSigners()
    const coverageAmount = helper.ether(500_000, PRECISION)

    // Purchase policy so that cxToken is created
    await deployed.dai.approve(deployed.policy.address, ethers.constants.MaxUint256)
    await deployed.policy.purchaseCover(owner.address, coverKey, helper.emptyBytes32, '1', coverageAmount, key.toBytes32(''))
    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    const expiryDate = await deployed.policy.getExpiryDate(block.timestamp, '1')
    const cxToken = await deployed.policy.getCxTokenByExpiryDate(coverKey, helper.emptyBytes32, expiryDate)
    cxToken.should.not.equal(helper.zerox)

    const result = await mockContract.getActiveLiquidityUnderProtection(coverKey, helper.emptyBytes32)
    result.should.equal(coverageAmount)
  })
})
