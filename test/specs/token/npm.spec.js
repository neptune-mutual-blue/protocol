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
  it('should be reject if zero amount was specified', async () => {
    const [owner, timelockOrOwner] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const issueTo = owner.address
    const amount = helper.ether(0)

    await npm.connect(timelockOrOwner).issue(issuanceKey, issueTo, amount)
      .should.be.rejectedWith('Invalid amount')
  })

  it('should revert if accessed by non-owner', async () => {
    const [owner] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const issueTo = owner.address
    const amount = helper.ether(100_000_000)

    await npm.issue(issuanceKey, issueTo, amount)
      .should.be.rejectedWith('Ownable: caller is not the owner')
  })

  it('should not exceed the cap', async () => {
    const [owner, timelockOrOwner] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const issueTo = owner.address
    const amount = ethers.BigNumber.from(helper.ether(900_000_000))

    await npm.connect(timelockOrOwner).issue(issuanceKey, issueTo, amount.add(1))
      .should.be.rejectedWith('Cap exceeded')
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

describe('NPM Token: Issue Many', () => {
  let npm

  beforeEach(async () => {
    const [, timelockOrOwner] = await ethers.getSigners()
    npm = await deployer.deploy(cache, 'NPM', timelockOrOwner.address)
  })

  it('should issue to many accounts correctly', async () => {
    const [, timelockOrOwner, alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await npm.connect(timelockOrOwner).issueMany(issuanceKey, receivers, amounts)

    for (const i in receivers) {
      const balance = await npm.balanceOf(receivers[i])
      balance.should.equal(amounts[i])
    }
  })

  it('should revert if accessed by non-owner', async () => {
    const [, , alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await npm.issueMany(issuanceKey, receivers, amounts)
      .should.be.rejectedWith('Ownable: caller is not the owner')
  })

  it('should revert when no account is supplied', async () => {
    const [, timelockOrOwner] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const receivers = []
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await npm.connect(timelockOrOwner).issueMany(issuanceKey, receivers, amounts)
      .should.be.rejectedWith('No receiver')
  })

  it('should revert when arguments have mismatch in number', async () => {
    const [, timelockOrOwner, alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500)]

    await npm.connect(timelockOrOwner).issueMany(issuanceKey, receivers, amounts)
      .should.be.rejectedWith('Invalid args')
  })

  it('should not exceed the cap', async () => {
    const [, timelockOrOwner, alice, bob, charles] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const receivers = [alice.address, bob.address, charles.address]
    const amounts = [helper.ether(500_000_000), helper.ether(500_000_000), '1']

    await npm.connect(timelockOrOwner).issueMany(issuanceKey, receivers, amounts)
      .should.be.rejectedWith('Cap exceeded')
  })

  it('should not allow issuances when paused', async () => {
    const [, timelockOrOwner, alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const issuanceKey = key.toBytes32('Seed Round Investors')
    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await npm.connect(timelockOrOwner).pause(true)
    await npm.connect(timelockOrOwner).issueMany(issuanceKey, receivers, amounts)
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

describe('NPM Token: Transfer Many', () => {
  let npm

  before(async () => {
    const [, timelockOrOwner] = await ethers.getSigners()
    npm = await deployer.deploy(cache, 'NPM', timelockOrOwner.address)

    const issuanceKey = key.toBytes32('Seed Round Investors')
    await npm.connect(timelockOrOwner).issue(issuanceKey, timelockOrOwner.address, helper.ether(1_000_000))
  })

  it('should transfer to many accounts correctly', async () => {
    const [, timelockOrOwner, alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await npm.connect(timelockOrOwner).transferMany(receivers, amounts)

    for (const i in receivers) {
      const balance = await npm.balanceOf(receivers[i])
      balance.should.equal(amounts[i])
    }
  })

  it('should revert if accessed by non-owner', async () => {
    const [, timelockOrOwner, alice, bob, charles, david, emily, frank, george] = await ethers.getSigners()

    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await npm.connect(timelockOrOwner).issue(key.toBytes32('test'), george.address, helper.ether(1_000_000))

    await npm.connect(george).transferMany(receivers, amounts)
      .should.be.rejectedWith('Ownable: caller is not the owner')
  })

  it('should revert when no account is supplied', async () => {
    const [, timelockOrOwner] = await ethers.getSigners()

    const receivers = []
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await npm.connect(timelockOrOwner).transferMany(receivers, amounts)
      .should.be.rejectedWith('No receiver')
  })

  it('should revert when arguments have mismatch in number', async () => {
    const [, timelockOrOwner, alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500)]

    await npm.connect(timelockOrOwner).transferMany(receivers, amounts)
      .should.be.rejectedWith('Invalid args')
  })

  it('should not allow transferMany when paused', async () => {
    const [, timelockOrOwner, alice, bob, charles, david, emily, frank] = await ethers.getSigners()

    const receivers = [alice.address, bob.address, charles.address, david.address, emily.address, frank.address]
    const amounts = [helper.ether(100), helper.ether(200), helper.ether(300), helper.ether(400), helper.ether(500), helper.ether(600)]

    await npm.connect(timelockOrOwner).pause(true)
    await npm.connect(timelockOrOwner).transferMany(receivers, amounts)
      .should.be.rejectedWith('Pausable: paused')
  })
})
