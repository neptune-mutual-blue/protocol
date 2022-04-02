/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('NPM Token: Constructor', () => {
  let timelockOrOwner, npm

  before(async () => {
    timelockOrOwner = helper.randomAddress()
    npm = await deployer.deploy(cache, 'NPM', timelockOrOwner)
  })

  it('should deploy correctly', async () => {
    const [owner] = await ethers.getSigners()

    const { events } = await npm.deployTransaction.wait()

    const [first, second] = events

    first.event.should.equal('OwnershipTransferred')
    second.event.should.equal('OwnershipTransferred')

    first.args.previousOwner.should.equal(helper.zerox)
    second.args.previousOwner.should.equal(owner.address)

    first.args.newOwner.should.equal(owner.address)
    second.args.newOwner.should.equal(timelockOrOwner)
  })
})

describe('NPM Token: Issuances', () => {
  let npm

  before(async () => {
    const [, timelockOrOwner] = await ethers.getSigners()
    npm = await deployer.deploy(cache, 'NPM', timelockOrOwner.address)
  })

  it('should issue correctly', async () => {
    const [owner, timelockOrOwner] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const issueTo = owner.address
    const amount = helper.ether(100_000_000)

    const tx = await npm.connect(timelockOrOwner).issue(issuanceKey, issueTo, amount)

    const { events } = await tx.wait()
    const event = await events.find(x => x.event === 'Minted')

    event.args.key.should.equal(issuanceKey)
    event.args.account.should.equal(owner.address)
    event.args.amount.should.equal(amount)

    const balance = await npm.balanceOf(owner.address)
    balance.should.equal(amount)
  })

  it('should not exceed the cap', async () => {
    const [owner, timelockOrOwner] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const issueTo = owner.address
    const amount = ethers.BigNumber.from(helper.ether(900_000_000))

    await npm.connect(timelockOrOwner).issue(issuanceKey, issueTo, amount.add(1))
      .should.be.rejectedWith('Error: can\'t exceed cap')
  })

  it('should not allow issuances when paused', async () => {
    const [owner, timelockOrOwner] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const issueTo = owner.address
    const amount = ethers.BigNumber.from(helper.ether(1))

    await npm.connect(timelockOrOwner).pause(true)

    await npm.connect(timelockOrOwner).issue(issuanceKey, issueTo, amount)
      .should.be.rejectedWith('Pausable: paused')
  })
})

describe('NPM Token: Transfers', () => {
  let npm

  before(async () => {
    const [, timelockOrOwner] = await ethers.getSigners()
    npm = await deployer.deploy(cache, 'NPM', timelockOrOwner.address)
  })

  it('should transfer correctly', async () => {
    const [owner, timelockOrOwner, alice] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const issueTo = owner.address
    const amount = helper.ether(100)

    await npm.connect(timelockOrOwner).issue(issuanceKey, issueTo, amount)

    await npm.transfer(alice.address, helper.ether(2))
    const ownerBalance = await npm.balanceOf(owner.address)
    const aliceBalance = await npm.balanceOf(alice.address)

    ownerBalance.should.equal(helper.ether(98))
    aliceBalance.should.equal(helper.ether(2))
  })

  it('should not allow transfers when paused', async () => {
    const [, timelockOrOwner, alice] = await ethers.getSigners()

    await npm.connect(timelockOrOwner).pause(true)

    await npm.transfer(alice.address, helper.ether(2))
      .should.be.rejectedWith('Pausable: paused')

    await npm.connect(timelockOrOwner).pause(false)

    await npm.transfer(alice.address, helper.ether(2)).should.not.be.rejected
  })
})
