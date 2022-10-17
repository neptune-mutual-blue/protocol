/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const moment = require('moment')
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
    const minStakeToReport = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)
    const reassuranceRate = helper.percentage(50)
    const leverageFactor = '1'

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
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
      leverageFactor
    })

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
    await deployed.npm.approve(deployed.vault.address, minStakeToReport)
    await deployed.vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })

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
    await deployed.protocol.addMember(mockStoreUser.address)
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

    const args = {
      onBehalfOf: owner.address,
      coverKey,
      productKey: helper.emptyBytes32,
      coverDuration: '1',
      amountToCover: coverageAmount,
      referralCode: key.toBytes32('')
    }

    await deployed.policy.purchaseCover(args)
    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    const expiryDate = await deployed.policy.getExpiryDate(block.timestamp, '1')
    const cxToken = await deployed.policy.getCxTokenByExpiryDate(coverKey, helper.emptyBytes32, expiryDate)
    cxToken.should.not.equal(helper.zerox)

    const result = await mockContract.getActiveLiquidityUnderProtection(coverKey, helper.emptyBytes32)
    result.should.equal(coverageAmount)
  })

  it('must return correct active protection when active incident is greater than zero and policies purchased', async () => {
    let daysToPass = 100// pass 100 days so that all previous policies expire

    {
      /* Optimization so that below loop only runs on 23, 24, 25, 26th */
      /* Find 23rd of the current/next month and add the days to `daysToPass` */

      const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      const blockDate = moment(block.timestamp * 1000).add(daysToPass, 'days').utc()

      const startDate = blockDate.clone().date(23) // 23rd of the current month
      if (blockDate.date() >= 25) {
        startDate.add(1, 'months') // 23rd of the next month
      }

      daysToPass += startDate.diff(blockDate, 'days') // number of days to pass to get to the 23rd
    }

    const [owner] = await ethers.getSigners()
    let totalCoverageAmount = helper.ether(0, PRECISION)

    await network.provider.send('evm_increaseTime', [daysToPass * DAYS])

    // block number only changes after this transaction even after increasing the time
    await deployed.dai.approve(deployed.policy.address, ethers.constants.MaxUint256)

    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    const currentDate = new Date(block.timestamp * 1000).getUTCDate()
    currentDate.should.equal(23) // Confirms if above optimization is done correctly

    // Purchase policies from 23rd to 26th of the month
    while (true) {
      // Exit if date >= 27
      const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
      const currentDate = new Date(block.timestamp * 1000).getUTCDate()
      if (currentDate >= 27) { break }

      const coverageAmount = helper.ether(10_000, PRECISION)

      const args = {
        onBehalfOf: owner.address,
        coverKey,
        productKey: helper.emptyBytes32,
        coverDuration: '1',
        amountToCover: coverageAmount,
        referralCode: key.toBytes32('')
      }

      await deployed.policy.purchaseCover(args)
      totalCoverageAmount = helper.add(totalCoverageAmount, coverageAmount)

      // Increase time by 1 day
      await network.provider.send('evm_increaseTime', [1 * DAYS])
    }

    const result = await mockContract.getActiveLiquidityUnderProtection(coverKey, helper.emptyBytes32)
    result.should.equal(totalCoverageAmount)
  })
})
