/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: initialize', () => {
  let deployed, store, protocol

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    store = await deployer.deploy(cache, 'Store')

    protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        RegistryLibV1: deployed.registryLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: deployed.factory.address,
      npm: deployed.npm.address,
      treasury: helper.randomAddress(),
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
      minStakeToAddLiquidity: helper.ether(0),
      firstReportingStake: helper.ether(250),
      claimPeriod: 7 * DAYS,
      reportingBurnRate: helper.percentage(30),
      governanceReporterCommission: helper.percentage(10),
      claimPlatformFee: helper.percentage(6.5),
      claimReporterCommission: helper.percentage(5),
      flashLoanFee: helper.percentage(0.5),
      flashLoanFeeProtocol: helper.percentage(2.5),
      resolutionCoolDownPeriod: 1 * DAYS,
      stateUpdateInterval: 1 * DAYS,
      maxLendingRatio: helper.percentage(5),
      lendingPeriod: 30 * 60 * 60,
      withdrawalWindow: 30 * 60 * 60,
      policyFloor: helper.percentage(7),
      policyCeiling: helper.percentage(45)
    }

    await protocol.initialize(args)

    await protocol.grantRoles([
      {
        account: owner.address,
        roles: [
          key.ACCESS_CONTROL.UPGRADE_AGENT,
          key.ACCESS_CONTROL.COVER_MANAGER,
          key.ACCESS_CONTROL.LIQUIDITY_MANAGER,
          key.ACCESS_CONTROL.PAUSE_AGENT,
          key.ACCESS_CONTROL.GOVERNANCE_ADMIN,
          key.ACCESS_CONTROL.UNPAUSE_AGENT
        ]
      }
    ])
    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, protocol.address)
  })

  it('correctly initialize the cover', async () => {
    const cover = await deployer.deployWithLibraries(cache, 'Cover',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        CoverLibV1: deployed.coverLibV1.address,
        CoverUtilV1: deployed.coverUtilV1.address,
        RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await protocol.addContract(key.PROTOCOL.CNS.COVER, cover.address)

    const tx = await cover.initialize(deployed.stablecoin.address, key.toBytes32('USDC'))
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'CoverInitialized')

    event.args.stablecoin.should.equal(deployed.stablecoin.address)
    event.args.withName.should.equal(key.toBytes32('USDC'))
  })

  it('reverts if already initialized', async () => {
    const cover = await deployer.deployWithLibraries(cache, 'Cover',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        CoverLibV1: deployed.coverLibV1.address,
        CoverUtilV1: deployed.coverUtilV1.address,
        RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await protocol.addContract(key.PROTOCOL.CNS.COVER, cover.address)

    await cover.initialize(deployed.stablecoin.address, key.toBytes32('USDC'))
    await cover.initialize(deployed.stablecoin.address, key.toBytes32('USDC'))
      .should.be.rejectedWith('Already initialized')
  })
})
