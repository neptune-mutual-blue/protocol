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

  it('must correctly drain', async () => {
    await deployed.stablecoin.mint(helper.ether(100, PRECISION))
    await deployed.stablecoin.transfer(compoundStrategy.address, helper.ether(100, PRECISION))

    const amount = helper.ether(10, PRECISION)
    const tx = await compoundStrategy.deposit(deployed.coverKey, amount)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'Drained')

    event.args.asset.should.equal(deployed.stablecoin.address)
    event.args.amount.should.equal(helper.ether(100, PRECISION))
  })
})
