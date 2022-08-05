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

describe('Aave Deposit', () => {
  let deployed, aaveLendingPool, aToken, aaveStrategy

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()
    await deployed.protocol.addMember(owner.address)

    aToken = await deployer.deploy(cache, 'FakeToken', 'aToken', 'aToken', helper.ether(100_000_000), 18)
    aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)

    aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address, aaveLendingPool.address, aToken.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_AAVE, aaveStrategy.address)

    await deployed.liquidityEngine.addStrategies([aaveStrategy.address])
  })

  it('must correctly deposit', async () => {
    const amount = helper.ether(10, PRECISION)
    const tx = await aaveStrategy.deposit(deployed.coverKey, amount)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'Deposited')

    event.args.key.should.equal(deployed.coverKey)
    event.args.onBehalfOf.should.equal(deployed.vault.address)
    event.args.stablecoinDeposited.should.equal(amount)
    event.args.certificateTokenIssued.should.be.gte(amount)

    const [deposited] = await aaveStrategy.getInfo(deployed.coverKey)
    deposited.should.equal(amount)
  })

  it('must return zero if zero amount is deposited', async () => {
    const value = await aaveStrategy.callStatic.deposit(deployed.coverKey, '0')
    value.should.equal('0')
  })

  it('must revert if deposit amount exceeds vault balance', async () => {
    await aaveStrategy.deposit(deployed.coverKey, helper.ether(240_000_000, PRECISION))
      .should.be.rejectedWith('Balance insufficient')
  })
})

describe('Aave Deposit: Faulty Pool', () => {
  let deployed, aaveLendingPool, aToken, aaveStrategy

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()
    await deployed.protocol.addMember(owner.address)

    aToken = await deployer.deploy(cache, 'FakeToken', 'aToken', 'aToken', helper.ether(100_000_000), 18)
    aaveLendingPool = await deployer.deploy(cache, 'FaultyAaveLendingPool', aToken.address)

    aaveStrategy = await deployer.deployWithLibraries(cache, 'AaveStrategy', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      NTransferUtilV2: deployed.transferLib.address,
      ProtoUtilV1: deployed.protoUtilV1.address,
      RegistryLibV1: deployed.registryLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address, aaveLendingPool.address, aToken.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.STRATEGY_AAVE, aaveStrategy.address)

    await deployed.liquidityEngine.addStrategies([aaveStrategy.address])
  })

  it('must revert if no certificate tokens were received', async () => {
    await aaveStrategy.deposit(deployed.coverKey, helper.ether(10, PRECISION))
      .should.be.rejectedWith('Deposit to Aave failed')
  })
})
