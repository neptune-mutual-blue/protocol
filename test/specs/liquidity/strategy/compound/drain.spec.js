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

describe('Compound Deposit: Drained', () => {
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

  it('must correctly drain', async () => {
    await deployed.dai.mint(helper.ether(100, PRECISION))
    await deployed.dai.transfer(compoundStrategy.address, helper.ether(100, PRECISION))

    const amount = helper.ether(10, PRECISION)
    const tx = await compoundStrategy.deposit(deployed.coverKey, amount)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'Drained')

    event.args.asset.should.equal(deployed.dai.address)
    event.args.amount.should.equal(helper.ether(100, PRECISION))
  })
})
