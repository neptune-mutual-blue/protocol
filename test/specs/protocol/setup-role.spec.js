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
  const treasury = helper.randomAddress()
  let npm, store, router, protocol

  before(async () => {
    const [owner] = await ethers.getSigners()

    const deployed = await deployDependencies()
    const { storeKeyUtil, protoUtilV1, accessControlLibV1, validationLibV1, baseLibV1, registryLibV1 } = deployed
    npm = deployed.npm
    store = deployed.store
    router = deployed.router

    protocol = await deployer.deployWithLibraries(cache, 'Protocol',
      {
        AccessControlLibV1: accessControlLibV1.address,
        BaseLibV1: baseLibV1.address,
        ProtoUtilV1: protoUtilV1.address,
        RegistryLibV1: registryLibV1.address,
        StoreKeyUtil: storeKeyUtil.address,
        ValidationLibV1: validationLibV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)
    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, protocol.address)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    await protocol.initialize(
      [
        helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        priceOracle.address
      ],
      [
        helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS, // cooldown period,
        1 * DAYS, // state and liquidity update interval
        helper.percentage(5)
      ]
    )
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
