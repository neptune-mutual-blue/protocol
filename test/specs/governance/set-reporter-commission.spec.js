const BigNumber = require('bignumber.js')
const { deployDependencies } = require('./deps')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Governance: `setReporterCommission` function', () => {
  const commission = '1'
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('must correctly set reporter commission', async () => {
    await deployed.governance.setReporterCommission(commission)
  })

  it('reverts when not accessed by CoverManager', async () => {
    const [, bob] = await ethers.getSigners()

    await deployed.governance.connect(bob).setReporterCommission(commission).should.be.rejectedWith('Forbidden')
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()
    await deployed.governance.setReporterCommission(commission).should.be.rejectedWith('Protocol is paused')
    await deployed.protocol.unpause()
  })

  it('reverts when zero is specified as commision', async () => {
    await deployed.governance.setReporterCommission('0').should.be.rejectedWith('Please specify value')
  })
})
