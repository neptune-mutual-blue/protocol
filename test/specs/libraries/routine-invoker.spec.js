/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const composer = require('../../../util/composer')
const { deployDependencies } = require('./deps')
const { expect } = require('chai')
const cache = null
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('RoutineInvokerLibV1: _executeStrategy', () => {
  let deployed, coverKey, mockLiquidityEngineUser, aaveLendingPool, aToken, aaveStrategy

  const initialLiquidity = helper.ether(1_000, PRECISION)
  const minStakeToReport = helper.ether(250)

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
    const stakeWithFee = helper.ether(10_000)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)
    const leverageFactor = '1'

    const info = key.toBytes32('info')

    deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
      coverKey,
      info,
      tokenName: 'POD',
      tokenSymbol: 'POD',
      supportsProducts: false,
      requiresWhitelist: false,
      stakeWithFee,
      initialReassuranceAmount,
      minStakeToReport,
      reportingPeriod,
      cooldownPeriod,
      claimPeriod,
      floor,
      ceiling,
      reassuranceRate: '2500',
      leverageFactor
    })

    aToken = await deployer.deploy(cache, 'FakeToken', 'aToken', 'aToken', helper.ether(100_000_000), 18)
    aaveLendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)

    await deployed.dai.addMinter(aaveLendingPool.address, true)

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

    deployed.vault = await composer.vault.getVault({
      store: deployed.store,
      libs: {
        accessControlLibV1: deployed.accessControlLibV1,
        baseLibV1: deployed.baseLibV1,
        transferLib: deployed.transferLib,
        protoUtilV1: deployed.protoUtilV1,
        registryLibV1: deployed.registryLibV1,
        validationLibV1: deployed.validationLibV1
      }
    }, coverKey)

    mockLiquidityEngineUser = await deployer.deployWithLibraries(
      cache,
      'MockLiquidityEngineUser',
      { StrategyLibV1: deployed.strategyLibV1.address },
      deployed.store.address
    )
    await deployed.protocol.addMember(mockLiquidityEngineUser.address)
  })

  it('must deposit all the balance when max lending ratio is greater than 1', async () => {
    await mockLiquidityEngineUser.setMaxLendingRatioInternal(helper.percentage(200))

    await network.provider.send('evm_increaseTime', [deployed.stateAndLiquidityUpdateInterval])

    await deployed.dai.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minStakeToReport)
    const tx = await deployed.vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
    const { events } = await tx.wait()

    // Deposit to strategies
    const event = events.find(x => x.event === 'StrategyTransfer')
    event.args.amount.should.equal(initialLiquidity)
  })

  it('must not deposit anything when max lending ratio is 0', async () => {
    await mockLiquidityEngineUser.setMaxLendingRatioInternal(helper.percentage(0))

    await network.provider.send('evm_increaseTime', [deployed.stateAndLiquidityUpdateInterval])

    await deployed.dai.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minStakeToReport)
    const tx = await deployed.vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'StrategyTransfer')
    expect(event).to.be.undefined
  })

  it('must withdraw from disabled strategies', async () => {
    await mockLiquidityEngineUser.setMaxLendingRatioInternal(helper.percentage(0))

    await deployed.liquidityEngine.disableStrategy(aaveStrategy.address)

    await network.provider.send('evm_increaseTime', [deployed.stateAndLiquidityUpdateInterval])

    await deployed.dai.approve(deployed.vault.address, initialLiquidity)
    await deployed.npm.approve(deployed.vault.address, minStakeToReport)
    const tx = await deployed.vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
    const { events } = await tx.wait()

    // Withdraws from disabled strategies
    const event = events.find(x => x.event === 'StrategyTransfer')
    event.args.amount.should.equal(initialLiquidity)
  })
})
