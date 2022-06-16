/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Vault: addLiquidity', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly adds liquidity', async () => {
    const coverKey = key.toBytes32('foo-bar')
    const amount = helper.ether(1_000, PRECISION)
    const npmStake = helper.ether(500)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(deployed.vault.address, npmStake)
    await deployed.dai.approve(deployed.vault.address, amount)

    const tx = await deployed.vault.addLiquidity(coverKey, amount, npmStake, referralCode)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'PodsIssued')
    event.args.referralCode.should.equal(referralCode)
  })

  it('correctly adds liquidity without NPM stake', async () => {
    const coverKey = key.toBytes32('foo-bar')
    const amount = '100'
    const npmStake = helper.ether(0)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(deployed.vault.address, npmStake)
    await deployed.dai.approve(deployed.vault.address, amount)

    await deployed.vault.addLiquidity(coverKey, amount, npmStake, referralCode)
      .should.not.be.rejected
  })

  it('reverts when coverkey is invalid', async () => {
    const coverKey = key.toBytes32('foo-bar2')
    const amount = helper.ether(1_000, PRECISION)
    const npmStake = helper.ether(500)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(deployed.vault.address, npmStake)
    await deployed.dai.approve(deployed.vault.address, amount)

    await deployed.vault.addLiquidity(coverKey, amount, npmStake, referralCode)
      .should.be.rejectedWith('Forbidden')
  })

  it('reverts when invalid amount is supplied', async () => {
    const coverKey = key.toBytes32('foo-bar')
    const amount = helper.ether(0)
    const npmStake = helper.ether(1)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(deployed.vault.address, npmStake)
    await deployed.dai.approve(deployed.vault.address, amount)

    await deployed.vault.addLiquidity(coverKey, amount, npmStake, referralCode)
      .should.be.rejectedWith('Please specify amount')
  })
})
