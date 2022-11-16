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
  let deployed, stablecoinDelegator, cStablecoin, compoundStrategy

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()
    await deployed.protocol.addMember(owner.address)

    cStablecoin = await deployer.deploy(cache, 'FakeToken', 'cStablecoin', 'cStablecoin', helper.ether(100_000_000), 18)
    stablecoinDelegator = await deployer.deploy(cache, 'FakeCompoundStablecoinDelegator', deployed.stablecoin.address, cStablecoin.address)

    compoundStrategy = await deployer.deployWithLibraries(cache, 'CompoundStrategy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address, stablecoinDelegator.address, cStablecoin.address)

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
  let deployed, stablecoinDelegator, compoundStrategy

  before(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()
    await deployed.protocol.addMember(owner.address)
    const cStablecoin = await deployer.deploy(cache, 'FakeToken', 'cStablecoin', 'cStablecoin', helper.ether(100_000_000), 18)

    stablecoinDelegator = await deployer.deploy(cache, 'FaultyCompoundStablecoinDelegator', deployed.stablecoin.address, cStablecoin.address, '1')

    compoundStrategy = await deployer.deployWithLibraries(cache, 'CompoundStrategy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address, stablecoinDelegator.address, cStablecoin.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_COMPOUND, compoundStrategy.address)

    await deployed.liquidityEngine.addStrategies([compoundStrategy.address])
  })

  it('must revert if stablecoin delegator returns an error code', async () => {
    await compoundStrategy.deposit(deployed.coverKey, helper.ether(10, PRECISION))
      .should.be.rejectedWith('Compound delegator mint failed')
  })

  it('must revert if no certificate tokens were received', async () => {
    await stablecoinDelegator.setReturnValue('0')

    await compoundStrategy.deposit(deployed.coverKey, helper.ether(10, PRECISION))
      .should.be.rejectedWith('Minting cUS$ failed')
  })
})
