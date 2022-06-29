/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../../../util')
const { deployDependencies } = require('../deps')
const cache = null
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Compound Deposit', () => {
  let deployed, daiDelegator, cDai, compoundStrategy

  beforeEach(async () => {
    deployed = await deployDependencies()

    cDai = await deployer.deploy(cache, 'FakeToken', 'cDai', 'cDai', helper.ether(100_000_000), 18)
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

  it('must correctly deposit', async () => {
    const amount = helper.ether(10, PRECISION)
    const tx = await compoundStrategy.deposit(deployed.coverKey, amount)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'Deposited')

    event.args.key.should.equal(deployed.coverKey)
    event.args.onBehalfOf.should.equal(deployed.vault.address)
    event.args.stablecoinDeposited.should.equal(amount)
    event.args.certificateTokenIssued.should.be.gte(amount)

    const [deposited] = await compoundStrategy.getInfo(deployed.coverKey)
    deposited.should.equal(amount)
  })

  it('must return zero if zero amount is deposited', async () => {
    const value = await compoundStrategy.callStatic.deposit(deployed.coverKey, '0')
    value.should.equal('0')
  })

  it('must revert if deposit amount exceeds vault balance', async () => {
    await compoundStrategy.deposit(deployed.coverKey, helper.ether(240_000_000, PRECISION))
      .should.be.rejectedWith('Balance insufficient')
  })
})

describe('Compound Deposit: Faulty Pool', () => {
  let deployed, daiDelegator, compoundStrategy

  before(async () => {
    deployed = await deployDependencies()
    const cDai = await deployer.deploy(cache, 'FakeToken', 'cDai', 'cDai', helper.ether(100_000_000), 18)

    daiDelegator = await deployer.deploy(cache, 'FaultyCompoundDaiDelegator', deployed.dai.address, cDai.address, '1')

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
    await compoundStrategy.deposit(deployed.coverKey, helper.ether(10, PRECISION))
      .should.be.rejectedWith('Compound delegator mint failed')
  })

  it('must revert if no certificate tokens were received', async () => {
    await daiDelegator.setReturnValue('0')

    await compoundStrategy.deposit(deployed.coverKey, helper.ether(10, PRECISION))
      .should.be.rejectedWith('Minting cDai failed')
  })
})
