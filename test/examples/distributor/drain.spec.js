/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, helper, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Distributor: `drain` function', () => {
  let deployed, treasury, feePercentage, distributor

  before(async () => {
    deployed = await deployDependencies()

    treasury = helper.randomAddress()
    feePercentage = helper.percentage(20)

    distributor = await deployer.deploy(cache, 'NpmDistributor', deployed.store.address, treasury, feePercentage)
  })

  it('must correctly drain the entire token balance', async () => {
    const coverKey = deployed.coverKey
    const amount = helper.ether(5000)
    const npmStake = helper.ether(1000)
    const referralCode = key.toBytes32('referral-code')

    await deployed.npm.approve(distributor.address, npmStake)
    await deployed.dai.approve(distributor.address, amount)

    await deployed.npm.transfer(distributor.address, helper.ether(3333))

    const tx = await distributor.addLiquidity(coverKey, amount, npmStake, referralCode)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'Drained')

    event.args.token.should.equal(deployed.npm.address)
    event.args.to.should.equal(treasury)
    event.args.amount.should.equal(helper.ether(3333))
  })
})
