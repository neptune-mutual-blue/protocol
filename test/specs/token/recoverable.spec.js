/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { waffle, ethers } = require('hardhat')
const { helper, deployer } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Recoverable: Recover Ether', () => {
  let npm, forceEther

  before(async () => {
    const [, timelockOrOwner] = await ethers.getSigners()

    npm = await deployer.deploy(cache, 'NPM', timelockOrOwner.address)
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
    await forceEther.destruct(npm.address)

    const balance = await waffle.provider.getBalance(npm.address)
    balance.should.equal(helper.ether(1))
  })

  it('must recover ETH sent to the contract', async () => {
    const [, timelockOrOwner] = await ethers.getSigners()

    const receiver = helper.randomAddress()
    await npm.connect(timelockOrOwner).recoverEther(receiver)

    const balance = await waffle.provider.getBalance(receiver)
    balance.should.equal(helper.ether(1))
  })
})

describe('Recoverable: Recover ERC-20 Tokens', () => {
  let npm, fakeToken

  before(async () => {
    const [, timelockOrOwner] = await ethers.getSigners()

    npm = await deployer.deploy(cache, 'NPM', timelockOrOwner.address)
    fakeToken = await deployer.deploy(cache, 'FakeToken', 'FAKE', 'FAKE', helper.ether(100_000))
  })

  it('must allow owner to recover ERC-20 tokens', async () => {
    const [, timelockOrOwner] = await ethers.getSigners()
    const receiver = helper.randomAddress()

    await fakeToken.transfer(npm.address, helper.ether(12345))

    await npm.connect(timelockOrOwner).recoverToken(fakeToken.address, receiver)

    const balance = await fakeToken.balanceOf(receiver)
    balance.should.equal(helper.ether(12345))
  })
})
