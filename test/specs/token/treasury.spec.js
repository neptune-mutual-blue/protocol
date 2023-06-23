/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Treasury: Transfer Many', () => {
  let npm, usdc, treasury

  before(async () => {
    const [, timelockOrOwner] = await ethers.getSigners()

    npm = await deployer.deploy(cache, 'NPM', timelockOrOwner.address, 'Neptune Mutual', 'NPM')
    usdc = await deployer.deploy(cache, 'NPM', timelockOrOwner.address, 'Fake USDC', 'USDC')
    treasury = await deployer.deploy(cache, 'Treasury', timelockOrOwner.address)

    const issuanceKey = key.toBytes32('Test')

    await npm.connect(timelockOrOwner).issueMany(issuanceKey, [treasury.address], [helper.ether(10_000)])
    await usdc.connect(timelockOrOwner).issueMany(issuanceKey, [treasury.address], [helper.ether(10_000)])
  })

  it('should transfer to many accounts correctly', async () => {
    const [, , alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await treasury.transferMany(npm.address, receivers, amounts)
    await treasury.transferMany(usdc.address, receivers, amounts)

    for (const i in receivers) {
      let balance = await npm.balanceOf(receivers[i])
      balance.should.equal(amounts[i])

      balance = await usdc.balanceOf(receivers[i])
      balance.should.equal(amounts[i])
    }
  })

  it('should revert if balance is insufficient', async () => {
    const [, , alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(10000), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await treasury.transferMany(npm.address, receivers, amounts)
      .should.be.rejectedWith('Insufficient Balance')
  })

  it('should revert if accessed by non-owner', async () => {
    const [, , alice, bob, charles, david, emily, frank, george] = await ethers.getSigners()

    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await treasury.connect(george).transferMany(npm.address, receivers, amounts)
      .should.be.rejectedWith('Ownable: caller is not the owner')
  })

  it('should revert when no account is supplied', async () => {
    const receivers = []
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await treasury.transferMany(npm.address, receivers, amounts)
      .should.be.rejectedWith('No receiver')
  })

  it('should revert when arguments have mismatch in number', async () => {
    const [, , alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500)]

    await treasury.transferMany(npm.address, receivers, amounts)
      .should.be.rejectedWith('Invalid args')
  })

  it('should not allow transferMany when paused', async () => {
    const [, , alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await treasury.pause(true)
    await treasury.transferMany(npm.address, receivers, amounts)
      .should.be.rejectedWith('Pausable: paused')
  })
})
