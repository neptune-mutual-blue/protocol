/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { deployer, key, helper, ipfs } = require('../../../util')
const blockHelper = require('../../../util/block')
const { deployDependencies } = require('./deps')
const cache = null
const DAYS = 86400

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('cxTokenFactory: Deploy', () => {
  let deployed, factory, coverKey

  before(async () => {
    const [owner] = await ethers.getSigners()
    deployed = await deployDependencies()

    coverKey = key.toBytes32('foo-bar')
    const stakeWithFee = helper.ether(10_000)
    const minStakeToReport = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const reassuranceAmount = '0'
    const floor = helper.percentage(1)
    const ceiling = helper.percentage(10)
    const reassuranceRate = helper.percentage(50)
    const leverageFactor = '1'

    const info = await ipfs.write([coverKey])

    factory = await deployer.deployWithLibraries(cache, 'cxTokenFactory', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address,
      cxTokenFactoryLibV1: deployed.cxTokenFactoryLib.address
    }, deployed.store.address)

    await deployed.protocol.addContract(key.PROTOCOL.CNS.COVER_CXTOKEN_FACTORY, factory.address)

    deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, reassuranceAmount)

    await deployed.cover.addCover({
      coverKey,
      info,
      tokenName: 'POD',
      tokenSymbol: 'POD',
      supportsProducts: false,
      requiresWhitelist: false,
      stakeWithFee,
      initialReassuranceAmount: '0',
      minStakeToReport,
      reportingPeriod,
      cooldownPeriod,
      claimPeriod,
      floor,
      ceiling,
      reassuranceRate,
      leverageFactor
    })
  })

  it('must successfully deploy a new cxToken', async () => {
    const [, alice] = await ethers.getSigners()
    const blockTimestamp = await blockHelper.getTimestamp()
    const expiryDate = blockTimestamp.add(2, 'd').unix()

    await deployed.protocol.addContract(key.PROTOCOL.CNS.COVER_POLICY, alice.address)

    const tx = await factory.connect(alice).deploy(coverKey, helper.emptyBytes32, 'Test', expiryDate)
    const { events } = await tx.wait()
    const event = events.find(x => x.event === 'CxTokenDeployed')

    event.args.coverKey.should.equal(coverKey)
    event.args.cxToken.should.not.equal(helper.zerox)
    event.args.expiryDate.should.equal(expiryDate)
  })

  it('reverts if invalid expiry date is supplied', async () => {
    const [, alice] = await ethers.getSigners()
    const expiryDate = '0'

    await factory.connect(alice).deploy(coverKey, helper.emptyBytes32, 'Test', expiryDate)
      .should.be.rejectedWith('Please specify expiry date')
  })

  it('reverts if already deployed', async () => {
    const [, alice] = await ethers.getSigners()
    const blockTimestamp = await blockHelper.getTimestamp()
    const expiryDate = blockTimestamp.add(4, 'd').unix()

    await factory.connect(alice).deploy(coverKey, helper.emptyBytes32, 'Test', expiryDate)
    await factory.connect(alice).deploy(coverKey, helper.emptyBytes32, 'Test', expiryDate)
      .should.be.rejectedWith('Already deployed')
  })
})
