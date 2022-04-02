/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer } = require('../../../util')
const DAYS = 86400
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Delayable', () => {
  it('should deploy correctly', async () => {
    const minDelay = 1 * DAYS
    const proposers = [helper.randomAddress()]
    const executors = [helper.randomAddress()]

    const delayable = await deployer.deploy(cache, 'Delayable', minDelay, proposers, executors)
    const { events } = await delayable.deployTransaction.wait()
    const event = events.find(x => x.event === 'MinDelayChange')

    event.args.oldDuration.should.equal('0')
    event.args.newDuration.should.equal(minDelay.toString())
  })
})
