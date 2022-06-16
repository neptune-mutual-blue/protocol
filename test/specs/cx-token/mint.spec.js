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

describe('cxToken: `mint` function', () => {
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

  it('must correctly mint', async () => {
    const [, bob] = await ethers.getSigners()
    const to = helper.randomAddress()
    const amount = '1'

    // Make bob -> policy contract
    const previous = deployed.policy.address
    await deployed.protocol.upgradeContract(key.PROTOCOL.CNS.COVER_POLICY, deployed.policy.address, bob.address)

    await cxToken.connect(bob).mint(coverKey, helper.emptyBytes32, to, amount)

    // Revert policy contract address
    await deployed.protocol.upgradeContract(key.PROTOCOL.CNS.COVER_POLICY, bob.address, previous)
  })

  it('must reject when the protocol is paused', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    await deployed.protocol.pause()
    await cxToken.mint(coverKey, helper.emptyBytes32, to, amount)
      .should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('must reject when invalid amount is supplied', async () => {
    const to = helper.randomAddress()
    const amount = '0'

    await cxToken.mint(coverKey, helper.emptyBytes32, to, amount).should.be.rejectedWith('Please specify amount')
  })

  it('must reject when invalid cover key is supplied', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    await cxToken.mint(key.toBytes32('foobar'), helper.emptyBytes32, to, amount)
      .should.be.rejectedWith('Invalid cover')
  })

  it('must reject when invalid product key is supplied', async () => {
    const to = helper.randomAddress()
    const amount = '1'

    await cxToken.mint(coverKey, key.toBytes32('foobar'), to, amount)
      .should.be.rejectedWith('Invalid product')
  })

  it('must reject when the caller is not policy contract', async () => {
    const [, bob] = await ethers.getSigners()
    const to = helper.randomAddress()
    const amount = '1'

    await cxToken.connect(bob).mint(coverKey, helper.emptyBytes32, to, amount).should.be.rejectedWith('Access denied')
  })
})
