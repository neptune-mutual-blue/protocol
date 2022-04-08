/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../../../util')
const { deployDependencies } = require('../deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Compound Withdrawal', () => {
  let deployed, daiDelegator, cDai, compoundStrategy

  beforeEach(async () => {
    deployed = await deployDependencies()

    cDai = await deployer.deploy(cache, 'FakeToken', 'cDai', 'cDai', helper.ether(100_000_000))
    daiDelegator = await deployer.deploy(cache, 'FakeCompoundDaiDelegator', deployed.dai.address, cDai.address)

    compoundStrategy = await deployer.deployWithLibraries(cache, 'CompoundStrategy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address, daiDelegator.address, cDai.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_COMPOUND, compoundStrategy.address)

    await deployed.liquidityEngine.addStrategies([compoundStrategy.address])
  })

  it('must correctly withdraw', async () => {
    const amount = helper.ether(10)
    await compoundStrategy.deposit(deployed.coverKey, amount)

    const cDais = await cDai.balanceOf(deployed.vault.address)
    const tx = await compoundStrategy.withdraw(deployed.coverKey)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'Withdrawn')

    event.args.key.should.equal(deployed.coverKey)
    event.args.sendTo.should.equal(deployed.vault.address)
    event.args.stablecoinWithdrawn.should.be.gte(amount)
    event.args.certificateTokenRedeemed.should.equal(cDais.toString())

    const [, withdrawn] = await compoundStrategy.getInfo(deployed.coverKey)
    withdrawn.should.equal(event.args.stablecoinWithdrawn)
  })

  it('must return zero if value has no balance', async () => {
    const result = await compoundStrategy.callStatic.withdraw(deployed.coverKey)
    result.should.equal('0')
  })
})

describe('Compound Withdrawal: Faulty Pool', () => {
  let deployed, daiDelegator, compoundStrategy

  before(async () => {
    deployed = await deployDependencies()
    const cDai = await deployer.deploy(cache, 'FakeToken', 'cDai', 'cDai', helper.ether(100_000_000))
    daiDelegator = await deployer.deploy(cache, 'FaultyCompoundDaiDelegator', deployed.dai.address, cDai.address, '1')

    await cDai.transfer(deployed.vault.address, helper.ether(1000))

    compoundStrategy = await deployer.deployWithLibraries(cache, 'CompoundStrategy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address, daiDelegator.address, cDai.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_COMPOUND, compoundStrategy.address)
    await deployed.liquidityEngine.addStrategies([compoundStrategy.address])
  })

  it('must revert if dai delegator returns an error code', async () => {
    await compoundStrategy.withdraw(deployed.coverKey)
      .should.be.rejectedWith('Compound delegator redeem failed')
  })

  it('must revert if no certificate tokens were received', async () => {
    await daiDelegator.setReturnValue('0')

    await compoundStrategy.withdraw(deployed.coverKey)
      .should.be.rejectedWith('Redeeming cDai failed')
  })
})
