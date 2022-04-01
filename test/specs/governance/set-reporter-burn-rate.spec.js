const BigNumber = require('bignumber.js')
const { deployDependencies } = require('./deps')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Governance: `setReportingBurnRate` function', () => {
  const burnRate = '1'
  let deployed

  beforeEach(async () => {
    deployed = await deployDependencies()
  })

  it('must correctly set reporter commission', async () => {
    const tx = await deployed.governance.setReportingBurnRate(burnRate)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'ReportingBurnRateSet')

    event.args.current.should.equal(burnRate)
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()
    await deployed.governance.setReportingBurnRate(burnRate).should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when zero is specified as burn rate', async () => {
    await deployed.governance.setReportingBurnRate('0').should.be.rejectedWith('Please specify value')
  })

  it('reverts when not accessed by CoverManager', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.governance.connect(bob).setReportingBurnRate(burnRate).should.be.rejectedWith('Forbidden')
  })
})
