/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { deployer, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Recoverable: Token', () => {
  let deployed, recoverable, fakeToken

  before(async () => {
    deployed = await deployDependencies()

    recoverable = await deployer.deployWithLibraries(cache, 'LiquidityEngine', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      StrategyLibV1: deployed.strategyLibV1.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    fakeToken = await deployer.deploy(cache, 'FakeToken', 'FAKE', 'FAKE', helper.ether(100_000))
  })

  it('must not allow non recovery agents to recover tokens', async () => {
    const [, alice] = await ethers.getSigners()
    const receiver = helper.randomAddress()

    await fakeToken.transfer(recoverable.address, helper.ether(5))
    await recoverable.connect(alice).recoverToken(fakeToken.address, receiver)
      .should.be.rejectedWith('Forbidden')
  })

  it('must not allow token recovery when the protocol is paused', async () => {
    await deployed.protocol.pause()
    const receiver = helper.randomAddress()

    await recoverable.recoverToken(fakeToken.address, receiver)
      .should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })

  it('must recover tokens sent to the contract', async () => {
    const receiver = helper.randomAddress()

    await fakeToken.transfer(recoverable.address, helper.ether(12340))
    await recoverable.recoverToken(fakeToken.address, receiver)

    const balance = await fakeToken.balanceOf(receiver)
    balance.should.equal(helper.ether(12345))
  })

  it('must not throw when contract token balance is zero', async () => {
    const receiver = helper.randomAddress()

    await recoverable.recoverToken(fakeToken.address, receiver)
      .should.not.be.rejected

    const balance = await fakeToken.balanceOf(receiver)
    balance.should.equal(helper.ether('0'))
  })
})
