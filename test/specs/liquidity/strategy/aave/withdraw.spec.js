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

describe('Aave Withdrawal', () => {
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

  it('must correctly withdraw', async () => {
    const amount = helper.ether(10, PRECISION)
    await aaveStrategy.deposit(deployed.coverKey, amount)

    const aTokens = await aToken.balanceOf(deployed.vault.address)
    const tx = await aaveStrategy.withdraw(deployed.coverKey)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'Withdrawn')

    event.args.key.should.equal(deployed.coverKey)
    event.args.sendTo.should.equal(deployed.vault.address)
    event.args.stablecoinWithdrawn.should.be.gte(amount)
    event.args.certificateTokenRedeemed.should.equal(aTokens.toString())

    const [, withdrawn] = await aaveStrategy.getInfo(deployed.coverKey)
    withdrawn.should.equal(event.args.stablecoinWithdrawn)
  })

  it('must return zero if value has no balance', async () => {
    const result = await aaveStrategy.callStatic.withdraw(deployed.coverKey)
    result.should.equal('0')
  })
})

describe('Aave Withdrawal: Faulty Pool', () => {
  let deployed, aaveLendingPool, aToken, aaveStrategy

  beforeEach(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()
    await deployed.protocol.addMember(owner.address)

    aToken = await deployer.deploy(cache, 'FakeToken', 'aToken', 'aToken', helper.ether(100_000_000), 18)
    aaveLendingPool = await deployer.deploy(cache, 'FaultyAaveLendingPool', aToken.address)

    await aToken.transfer(deployed.vault.address, helper.ether(1000))

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

  it('must revert if no stablecoins were received', async () => {
    await aaveStrategy.withdraw(deployed.coverKey)
      .should.be.rejectedWith('Redeeming aToken failed')
  })
})
