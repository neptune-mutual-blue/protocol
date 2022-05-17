/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { waffle, ethers } = require('hardhat')
const { helper, deployer } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: Recover Ether', () => {
  let store, forceEther

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
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
    await forceEther.destruct(store.address)

    const balance = await waffle.provider.getBalance(store.address)
    balance.should.equal(helper.ether(1))
  })

  it('must recover ETH sent to the contract', async () => {
    const receiver = helper.randomAddress()
    await store.recoverEther(receiver)

    const balance = await waffle.provider.getBalance(receiver)
    balance.should.equal(helper.ether(1))
  })
})

describe('Store: Recover ERC-20 Tokens', () => {
  let store, fakeToken

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
    fakeToken = await deployer.deploy(cache, 'FakeToken', 'FAKE', 'FAKE', helper.ether(100_000))
  })

  it('must allow owner to recover ERC-20 tokens', async () => {
    const receiver = helper.randomAddress()

    await fakeToken.transfer(store.address, helper.ether(12345))

    await store.recoverToken(fakeToken.address, receiver)

    const balance = await fakeToken.balanceOf(receiver)
    balance.should.equal(helper.ether(12345))
  })

  it('must not throw even when the contract has no token balance', async () => {
    const receiver = helper.randomAddress()
    await store.recoverToken(fakeToken.address, receiver)
      .should.not.rejected// although the contract has zero balance
  })
})
