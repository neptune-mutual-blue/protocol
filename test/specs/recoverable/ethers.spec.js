/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { waffle, ethers } = require('hardhat')
const { deployer, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Recoverable: Ether', () => {
  let deployed, recoverable, forceEther

  before(async () => {
    deployed = await deployDependencies()

    recoverable = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    forceEther = await deployer.deploy(cache, 'ForceEther')
  })

  it('must allow `ForceEther` contract to receive ethers', async () => {
    const [owner] = await ethers.getSigners()

    await owner.sendTransaction({
      to: forceEther.address,
      value: ethers.utils.parseEther('1')
    })

    const balance = await waffle.provider.getBalance(forceEther.address)
    balance.should.equal(helper.ether(1))
  })

  it('must allow `ForceEther` contract to destroy itself', async () => {
    await forceEther.destruct(recoverable.address)

    const balance = await waffle.provider.getBalance(recoverable.address)
    balance.should.equal(helper.ether(1))
  })

  it('must not allow non recovery agents to recover ethers', async () => {
    const [, alice] = await ethers.getSigners()
    const receiver = helper.randomAddress()
    await recoverable.connect(alice).recoverEther(receiver)
      .should.be.rejectedWith('Forbidden')
  })

  it('must not allow ether recovery when the protocol is paused', async () => {
    await deployed.protocol.pause()
    const receiver = helper.randomAddress()
    await recoverable.recoverEther(receiver)
      .should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })

  it('must recover ETH sent to the contract', async () => {
    const receiver = helper.randomAddress()
    await recoverable.recoverEther(receiver)

    const balance = await waffle.provider.getBalance(receiver)
    balance.should.equal(helper.ether(1))
  })
})
