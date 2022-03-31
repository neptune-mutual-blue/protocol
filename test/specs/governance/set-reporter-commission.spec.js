const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('governance: `setReporterCommission` function', () => {
  const treasury = helper.randomAddress()
  const reassuranceVault = helper.randomAddress()

  let npm, store, protocol, router,
    accessControlLibV1,
    baseLibV1,
    coverUtilV1,
    governanceUtilV1,
    transferLib,
    protoUtilV1,
    registryLibV1,
    storeKeyUtil,
    validationLibV1,
    governanceContract

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    const deployed = await deployDependencies()

    npm = deployed.npm
    store = deployed.store
    router = deployed.router

    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    coverUtilV1 = deployed.coverUtilV1
    governanceUtilV1 = deployed.governanceUtilV1
    transferLib = deployed.transferLib
    protoUtilV1 = deployed.protoUtilV1
    registryLibV1 = deployed.registryLibV1
    storeKeyUtil = deployed.storeKeyUtil
    validationLibV1 = deployed.validationLibV1

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

    await protocol.grantRoles([
      {
        account: protocol.address,
        roles: [
          key.ACCESS_CONTROL.COVER_MANAGER,
          key.ACCESS_CONTROL.UPGRADE_AGENT
        ]
      },
      {
        account: owner.address,
        roles: [
          key.ACCESS_CONTROL.COVER_MANAGER,
          key.ACCESS_CONTROL.UPGRADE_AGENT
        ]
      }
    ])

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

    governanceContract = await deployer.deployWithLibraries(cache, 'Governance', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      CoverUtilV1: coverUtilV1.address,
      GovernanceUtilV1: governanceUtilV1.address,
      NTransferUtilV2: transferLib.address,
      ProtoUtilV1: protoUtilV1.address,
      RegistryLibV1: registryLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    await protocol.addContract(key.PROTOCOL.CNS.GOVERNANCE, governanceContract.address)
  })

  it('must correctly set reporter commission', async () => {
    const [owner] = await ethers.getSigners()
    const commission = '1'

    await governanceContract.connect(owner).setReporterCommission(commission)
  })
})
