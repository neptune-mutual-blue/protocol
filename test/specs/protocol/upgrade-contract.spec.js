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

describe('Upgrading Protocol Contract(s)', () => {
  const treasury = helper.randomAddress()
  const reassuranceVault = helper.randomAddress()
  let npm, store, router, protocol

  beforeEach(async () => {
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

    await protocol.initialize(
      [helper.zero1,
        router.address,
        helper.randomAddress(), // factory
        npm.address,
        treasury,
        reassuranceVault],
      [helper.ether(0), // Cover Fee
        helper.ether(0), // Min Cover Stake
        helper.ether(250), // Min Reporting Stake
        7 * DAYS, // Claim period
        helper.ether(0.3), // Governance Burn Rate: 30%
        helper.ether(0.1), // Governance Reporter Commission: 10%
        helper.ether(0.065), // Claim: Platform Fee: 6.5%
        helper.ether(0.005), // Claim: Reporter Commission: 5%
        helper.ether(0.0005), // Flash Loan Fee: 0.5%
        helper.ether(0.0025), // Flash Loan Protocol Fee: 2.5%
        1 * DAYS // cooldown period
      ]
    )
  })

  it('should correctly upgrade a contract', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, fakeCover)

    const fakeCover2 = helper.randomAddress()
    await protocol.upgradeContract(key.PROTOCOL.CNS.COVER, fakeCover, fakeCover2)
  })

  it('should fail when the previous address is incorrect', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, fakeCover)

    const fakeCover2 = helper.randomAddress()
    await protocol.upgradeContract(key.PROTOCOL.CNS.COVER, helper.randomAddress(), fakeCover2)
      .should.be.rejectedWith('Not a protocol member')
  })

  it('should correctly set storage values', async () => {
    const cover = helper.randomAddress()
    await protocol.addContract(key.PROTOCOL.CNS.COVER, cover)

    let storedContractAddress = await store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER))

    storedContractAddress.should.equal(cover)

    // ------- UPGRADE CONTRACT -------

    const cover2 = helper.randomAddress()
    await protocol.upgradeContract(key.PROTOCOL.CNS.COVER, cover, cover2)

    storedContractAddress = await store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER))
    storedContractAddress.should.equal(cover2)
  })
})
