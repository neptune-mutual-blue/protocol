/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployDependencies } = require('./deps')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: setCoverCreationFee', () => {
  let deployed

  beforeEach(async () => {
    deployed = await deployDependencies()
  })

  it('correctly sets cover fees', async () => {
    const fees = '1'

    const tx = await deployed.cover.setCoverCreationFee(fees)
    const { events } = await tx.wait()

    const event = events.find(x => x.event === 'CoverCreationFeeSet')
    event.args.previous.should.equal('0')
    event.args.current.should.equal(fees)
  })

  it('reverts when invalid value is passed as cover fees', async () => {
    const fees = '0'

    await deployed.cover.setCoverCreationFee(fees)
      .should.be.rejectedWith('Please specify value')
  })

  it('reverts when protocol is paused', async () => {
    const fees = '1'

    await deployed.protocol.pause()
    await deployed.cover.setCoverCreationFee(fees)
      .should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when not accessed by cover manager', async () => {
    const [, bob] = await ethers.getSigners()
    const fees = '1'

    await deployed.cover.connect(bob).setCoverCreationFee(fees)
      .should.be.rejectedWith('Forbidden')
  })
})
