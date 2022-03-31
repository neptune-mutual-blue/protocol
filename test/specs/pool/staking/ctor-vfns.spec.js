/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Staking Pool Constructor and Views', () => {
  let store, storeKeyUtil, accessControlLibV1, baseLibV1, stakingPoolCoreLibV1, stakingPoolLibV1, validationLibV1

  before(async () => {
    const deployed = await deployDependencies()

    store = deployed.store
    storeKeyUtil = deployed.storeKeyUtil
    accessControlLibV1 = deployed.accessControlLibV1
    baseLibV1 = deployed.baseLibV1
    stakingPoolCoreLibV1 = deployed.stakingPoolCoreLibV1
    stakingPoolLibV1 = deployed.stakingPoolLibV1
    validationLibV1 = deployed.validationLibV1
  })

  it('correctly deploys', async () => {
    const stakingPoolContract = await deployer.deployWithLibraries(cache, 'StakingPools', {
      AccessControlLibV1: accessControlLibV1.address,
      BaseLibV1: baseLibV1.address,
      StakingPoolCoreLibV1: stakingPoolCoreLibV1.address,
      StakingPoolLibV1: stakingPoolLibV1.address,
      StoreKeyUtil: storeKeyUtil.address,
      ValidationLibV1: validationLibV1.address
    }, store.address)

    stakingPoolContract.address.should.not.be.empty
    stakingPoolContract.address.should.not.equal(helper.zerox)
    ; (await stakingPoolContract.version()).should.equal(key.toBytes32('v0.1'))
    ; (await stakingPoolContract.getName()).should.equal(key.PROTOCOL.CNAME.STAKING_POOL)
  })
})
