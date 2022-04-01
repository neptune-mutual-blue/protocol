/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Resolution Constructor', () => {
  let deployed

  before(async () => {
    deployed = await deployDependencies()
  })

  it('correctly deploys', async () => {
    const resolution = await deployer.deployWithLibraries(cache, 'Resolution',
      {
        AccessControlLibV1: deployed.accessControlLibV1.address,
        BaseLibV1: deployed.baseLibV1.address,
        RoutineInvokerLibV1: deployed.routineInvokerLibV1.address,
        StoreKeyUtil: deployed.storeKeyUtil.address,
        ProtoUtilV1: deployed.protoUtilV1.address,
        CoverUtilV1: deployed.coverUtilV1.address,
        NTransferUtilV2: deployed.transferLib.address,
        ValidationLibV1: deployed.validationLibV1.address,
        GovernanceUtilV1: deployed.governanceUtilV1.address
      },
      deployed.store.address
    )

    const version = await resolution.version()
    const name = await resolution.getName()

    version.should.equal(key.toBytes32('v0.1'))
    name.should.equal(key.PROTOCOL.CNAME.RESOLUTION)
  })
})
