const moment = require('moment')
const BigNumber = require('bignumber.js')
const { key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const composer = require('../../../util/composer')
const cxTokenUtil = require('../../../util/cxToken')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('cxToken: `getCoverageStartsFrom` function', () => {
  let cxToken, deployed, coverKey

  beforeEach(async () => {
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

    const amountToCover = helper.ether(100_000, PRECISION)

    await deployed.npm.approve(deployed.governance.address, helper.ether(1000))

    await deployed.dai.approve(deployed.policy.address, ethers.constants.MaxUint256)
    await deployed.policy.purchaseCover(owner.address, coverKey, helper.emptyBytes32, '1', amountToCover, key.toBytes32(''))
    const at = (await deployed.policy.getCxToken(coverKey, helper.emptyBytes32, '1')).cxToken
    cxToken = await cxTokenUtil.atAddress(at, {
      accessControlLibV1: deployed.accessControlLibV1,
      baseLibV1: deployed.baseLibV1,
      governanceUtilV1: deployed.governanceUtilV1,
      policyHelperV1: deployed.policyHelperV1,
      protoUtilV1: deployed.protoUtilV1,
      validationLibV1: deployed.validationLibV1
    })
  })

  it('must correctly give the coverage starts from amount', async () => {
    const [, bob, charles] = await ethers.getSigners()
    const amount = '100'

    // Make bob -> policy contract
    const previous = deployed.policy.address
    await deployed.protocol.upgradeContract(key.PROTOCOL.CNS.COVER_POLICY, deployed.policy.address, bob.address)

    await cxToken.connect(bob).mint(coverKey, helper.emptyBytes32, charles.address, amount)

    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    const tomorrowEOD = moment((block.timestamp + 1 * DAYS) * 1000).utc().endOf('day').unix()
    const coverageStartsFrom = await cxToken.getCoverageStartsFrom(charles.address, tomorrowEOD)
    coverageStartsFrom.should.equal(amount)

    // Revert policy contract address
    await deployed.protocol.upgradeContract(key.PROTOCOL.CNS.COVER_POLICY, bob.address, previous)
  })

  it('must return zero when no policies are purchased', async () => {
    const [, bob] = await ethers.getSigners()

    const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber())

    const coverageStartsFrom = await cxToken.getCoverageStartsFrom(bob.address, block.timestamp)
    await coverageStartsFrom.should.equal(0)
  })
})
