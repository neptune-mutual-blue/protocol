/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper } = require('../../../../util')
const { deployDependencies } = require('./deps')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: setMinCoverCreationStake', () => {
  let deployed

  beforeEach(async () => {
    deployed = await deployDependencies()
  })

  it('correctly sets min cover creation stake', async () => {
    const minStake = '1'

    const tx = await deployed.cover.setMinCoverCreationStake(minStake)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'MinCoverCreationStakeSet')
    event.args.previous.should.equal(helper.ether(2))
    event.args.current.should.equal(minStake)
  })

  it('reverts when invalid value is passed as min stake', async () => {
    const minStake = '0'

    await deployed.cover.setMinCoverCreationStake(minStake)
      .should.be.rejectedWith('Please specify value')
  })

  it('reverts when protocol is paused', async () => {
    const minStake = '1'

    await deployed.protocol.pause()
    await deployed.cover.setMinCoverCreationStake(minStake)
      .should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when not accessed by cover manager', async () => {
    const [, bob] = await ethers.getSigners()
    const minStake = '1'

    await deployed.cover.connect(bob).setMinCoverCreationStake(minStake)
      .should.be.rejectedWith('Forbidden')
  })
})
