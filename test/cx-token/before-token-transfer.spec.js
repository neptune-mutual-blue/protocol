const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../util')
const { deployDependencies } = require('./deps')
const blockHelper = require('../util/block')

const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('cxToken: `_beforeTokenTransfer` function', () => {
  let libraries, cxToken, store, policy

  const coverKey = key.toBytes32('test')

  beforeEach(async () => {
    const blockTimestamp = await blockHelper.getTimestamp()
    const expiryDate = blockTimestamp.add(2, 'd').unix()

    libraries = await deployDependencies()
    store = await deployer.deploy(cache, 'MockCxTokenStore')
    cxToken = await deployer.deployWithLibraries(cache, 'cxToken', libraries.dependencies, store.address, coverKey, expiryDate, 'cxToken', 'cxToken')
    policy = await deployer.deploy(cache, 'MockCxTokenPolicy', cxToken.address)
  })

  it('must fail if an expired cxToken is transferred to a non-zero address', async () => {
    const [owner] = await ethers.getSigners()
    const amount = '100'

    await store.initialize()
    await store.registerPolicyContract(policy.address)

    await policy.callMint(coverKey, owner.address, amount)

    await ethers.provider.send('evm_increaseTime', [DAYS * 3])

    await cxToken.burn('85')

    await cxToken.transfer(helper.zero1, '1')
      .should.be.rejectedWith('Expired cxToken')
  })
})
