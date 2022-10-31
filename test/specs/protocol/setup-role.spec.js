/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Setup roles in protocol', () => {
  let store, protocol

  before(async () => {
    const [owner] = await ethers.getSigners()

    const deployed = await deployDependencies()
    store = deployed.store

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

    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)
    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, protocol.address)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: deployed.router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
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
      maxLendingRatio: helper.percentage(5)
    }

    await protocol.initialize(args)
  })

  it('should correctly setup a role admin only', async () => {
    await protocol.setupRole(key.ACCESS_CONTROL.COVER_MANAGER, key.ACCESS_CONTROL.ADMIN, helper.zerox)
    const admin = await protocol.getRoleAdmin(key.ACCESS_CONTROL.COVER_MANAGER)
    const hasRole = await protocol.hasRole(key.ACCESS_CONTROL.COVER_MANAGER, helper.zerox)

    admin.should.equal(key.ACCESS_CONTROL.ADMIN)
    hasRole.should.be.false
  })

  it('should correctly setup both role and admin', async () => {
    const [owner] = await ethers.getSigners()

    await protocol.setupRole(key.ACCESS_CONTROL.COVER_MANAGER, key.ACCESS_CONTROL.ADMIN, owner.address)
    const admin = await protocol.getRoleAdmin(key.ACCESS_CONTROL.COVER_MANAGER)
    const hasRole = await protocol.hasRole(key.ACCESS_CONTROL.COVER_MANAGER, owner.address)

    admin.should.equal(key.ACCESS_CONTROL.ADMIN)
    hasRole.should.be.true
  })

  it('should fail if the protocol is paused', async () => {
    const [owner, pauser] = await ethers.getSigners()
    await protocol.grantRoles([{ account: pauser.address, roles: [key.ACCESS_CONTROL.PAUSE_AGENT, key.ACCESS_CONTROL.UNPAUSE_AGENT] }])

    await protocol.connect(pauser).pause()
    await protocol.setupRole(key.ACCESS_CONTROL.COVER_MANAGER, key.ACCESS_CONTROL.ADMIN, owner.address).should.be.rejectedWith('Protocol is paused')
    await protocol.connect(pauser).unpause()
  })

  it('should fail if the a non-admin tries to setup a role', async () => {
    const [owner] = await ethers.getSigners()

    await protocol.revokeRole(key.ACCESS_CONTROL.ADMIN, owner.address)

    await protocol.setupRole(
      key.ACCESS_CONTROL.COVER_MANAGER,
      key.ACCESS_CONTROL.ADMIN,
      owner.address
    ).should.be.rejectedWith('Forbidden')
  })
})
