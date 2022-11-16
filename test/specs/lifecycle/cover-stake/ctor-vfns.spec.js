/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('CoverStake: Constructor', () => {
  let deployed, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    deployed.policy = await deployer.deployWithLibraries(cache, 'Policy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      CoverUtilV1: deployed.coverUtilV1.address,
      PolicyHelperV1: deployed.policyHelperV1.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY, deployed.policy.address)

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
    await deployed.stablecoin.approve(deployed.cover.address, initialReassuranceAmount)

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

    await deployed.stablecoin.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minStakeToReport)
    await deployed.vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
  })

  it('correctly deploys', async () => {
    const coverStake = await deployer.deployWithLibraries(cache, 'CoverStake',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        CoverUtilV1: deployed.coverUtilV1.address,
        NTransferUtilV2: deployed.transferLib.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      deployed.store.address
    )

    const version = await coverStake.version()
    const name = await coverStake.getName()

    version.should.equal(key.toBytes32('v0.1'))
    name.should.equal(key.PROTOCOL.CNAME.COVER_STAKE)
  })
})
