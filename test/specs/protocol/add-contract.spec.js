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

describe('Adding a New Protocol Contract', () => {
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

    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)
    await protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, protocol.address)

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

    const args = {
      burner: helper.zero1,
      uniswapV2RouterLike: router.address,
      uniswapV2FactoryLike: helper.randomAddress(),
      npm: npm.address,
      treasury: helper.randomAddress(),
      priceOracle: priceOracle.address,
      coverCreationFee: helper.ether(0),
      minCoverCreationStake: helper.ether(0),
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

  it('should correctly add a new contract', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, fakeCover)
  })

  it('should reject if a contract already exists', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, fakeCover).should.be.rejectedWith('Please upgrade ')
  })

  it('should correctly set storage values', async () => {
    const fakePolicy = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY, fakePolicy)

    const storedAddress = await store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER_POLICY))

    storedAddress.should.equal(fakePolicy)
  })
})
