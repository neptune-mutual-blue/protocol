/* eslint-disable no-unused-expressions */
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

describe('Vault Library', () => {
  let deployed, mockContract, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
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

    // await deployed.dai.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minReportingStake)
    // await deployed.vault.addLiquidity(coverKey, initialLiquidity, minReportingStake, key.toBytes32(''))

    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockVaultLibUser',
      {
        StoreKeyUtil: deployed.storeKeyUtil.address,
        VaultLibV1: deployed.vaultLib.address
      },
      deployed.store.address
    )
    await deployed.protocol.addMember(mockContract.address)
  })

  describe('VaultLibV1: calculatePodsInternal', () => {
    it('must revert when flashloan is going on', async () => {
      await mockContract.setFlashLoanStatus(coverKey, true)

      await deployed.vault.calculatePods(helper.ether(1))
        .should.be.rejectedWith('On flash loan, please try again')

      await mockContract.setFlashLoanStatus(coverKey, false)
    })

    it('must revert when pod and liquidity mismatch', async () => {
      await deployed.dai.transfer(deployed.vault.address, helper.ether(1, PRECISION))

      await deployed.vault.calculatePods(helper.ether(1, PRECISION))
        .should.be.rejectedWith('Liquidity/POD mismatch')
    })
  })

  describe('VaultLibV1: calculateLiquidityInternal', () => {
    it('must revert when flashloan is going on', async () => {
      await mockContract.setFlashLoanStatus(coverKey, true)

      await deployed.vault.calculateLiquidity(helper.ether(1))
        .should.be.rejectedWith('On flash loan, please try again')

      await mockContract.setFlashLoanStatus(coverKey, false)
    })
  })

  describe('VaultLibV1: preAddLiquidityInternal', () => {
    it('must revert when invalid account is passed', async () => {
      await mockContract.preAddLiquidityInternal(coverKey, deployed.vault.address, helper.zerox, helper.ether(1), helper.ether(1))
        .should.be.rejectedWith('Invalid account')
    })
  })

  describe('VaultLibV1: _updateNpmStake', () => {
    it('must revert when invalid stake is passed', async () => {
      const [owner] = await ethers.getSigners()

      await mockContract.preAddLiquidityInternal(coverKey, deployed.vault.address, owner.address, helper.ether(1), helper.ether(1))
        .should.be.rejectedWith('Insufficient stake')
    })
  })

  describe('VaultLibV1: mustHaveNoBalanceInStrategies', () => {
    it('must revert when strategy balance is zero', async () => {
      await mockContract.setAmountInStrategies(coverKey, deployed.dai.address, 1)

      await mockContract.mustHaveNoBalanceInStrategies(coverKey, deployed.dai.address)
        .should.be.rejectedWith('Strategy balance is not zero')
    })
  })

  describe('VaultLibV1: _redeemPodCalculation', () => {
    it('must correctly return releaseAmount when podsToRedeem is zero', async () => {
      const [owner] = await ethers.getSigners()

      const tx = await mockContract.preRemoveLiquidityInternal(coverKey, deployed.vault.address, owner.address, 0, 0, true)
      await tx.wait()
    })
  })

  describe('VaultLibV1: getMaxFlashLoanInternal', () => {
    it('must revert if stablecoin address not found', async () => {
      await mockContract.setAddressByKey(key.PROTOCOL.CNS.COVER_STABLECOIN, helper.zerox)

      await mockContract.getMaxFlashLoanInternal(coverKey, deployed.vault.address)
        .should.be.rejectedWith('Cover liquidity uninitialized')

      await mockContract.setAddressByKey(key.PROTOCOL.CNS.COVER_STABLECOIN, deployed.dai.address)
    })

    it('must return zero if token is not stablecoin', async () => {
      const result = await mockContract.getMaxFlashLoanInternal(coverKey, deployed.vault.address)
      result.should.equal(0)
    })
  })
})
