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

    await protocol.initialize(
      [
        helper.zero1,
        deployed.router.address,
        deployed.factory.address, // factory
        deployed.npm.address,
        helper.randomAddress(),
        priceOracle.address
      ],
      [
        helper.ether(0), // Cover Fee
        helper.ether(10), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.percentage(30), // Governance Burn Rate: 30%
        helper.percentage(10), // Governance Reporter Commission: 10%
        helper.percentage(6.5), // Claim: Platform Fee: 6.5%
        helper.percentage(5), // Claim: Reporter Commission: 5%
        helper.percentage(0.5), // Flash Loan Fee: 0.5%
        helper.percentage(2.5), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    )

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
        RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await protocol.addContract(key.PROTOCOL.CNS.COVER, cover.address)

    const tx = await cover.initialize(deployed.dai.address, key.toBytes32('DAI'))
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'CoverInitialized')

    event.args.stablecoin.should.equal(deployed.dai.address)
    event.args.withName.should.equal(key.toBytes32('DAI'))
  })

  it('reverts if already initialized', async () => {
    const cover = await deployer.deployWithLibraries(cache, 'Cover',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        CoverLibV1: deployed.coverLibV1.address,
        RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ValidationLibV1: deployed.validationLibV1.address
      },
      store.address
    )

    await protocol.addContract(key.PROTOCOL.CNS.COVER, cover.address)

    await cover.initialize(deployed.dai.address, key.toBytes32('DAI'))
    await cover.initialize(deployed.dai.address, key.toBytes32('DAI'))
      .should.be.rejectedWith('Already initialized')
  })
})
