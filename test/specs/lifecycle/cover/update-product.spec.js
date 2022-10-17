/* eslint-disable no-unused-expressions */
const { ethers, network } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const { deployDependencies } = require('./deps')
const composer = require('../../../../util/composer')
const DAYS = 86400
const HOURS = 60 * 60
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: updateProduct', () => {
  let deployed

  const coverKey = key.toBytes32('foo-bar')
  const initialReassuranceAmount = helper.ether(1_000_000, PRECISION)
  const stakeWithFee = helper.ether(10_000)
  const minStakeToReport = helper.ether(250)
  const reportingPeriod = 7 * DAYS
  const cooldownPeriod = 1 * DAYS
  const claimPeriod = 7 * DAYS
  const floor = helper.percentage(7)
  const ceiling = helper.percentage(45)
  const reassuranceRate = helper.percentage(50)
  const leverageFactor = '1'

  const requiresWhitelist = false
  const info = key.toBytes32('info')

  before(async () => {
    const [owner] = await ethers.getSigners()

    deployed = await deployDependencies()

    deployed.cover.updateCoverCreatorWhitelist([owner.address], [true])

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.dai.approve(deployed.cover.address, initialReassuranceAmount)

    await deployed.cover.addCover({
      coverKey,
      info,
      tokenName: 'POD',
      tokenSymbol: 'POD',
      supportsProducts: true,
      requiresWhitelist: false,
      stakeWithFee,
      initialReassuranceAmount,
      minStakeToReport,
      reportingPeriod,
      cooldownPeriod,
      claimPeriod,
      floor,
      ceiling,
      reassuranceRate,
      leverageFactor
    })

    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    })

    const initialLiquidity = helper.ether(4_000_000, PRECISION)

    const vault = await composer.vault.getVault({
      store: deployed.store,
      libs: {
        accessControlLibV1: deployed.accessControlLibV1,
        baseLibV1: deployed.baseLibV1,
        transferLib: deployed.transferLib,
        protoUtilV1: deployed.protoUtilV1,
        registryLibV1: deployed.registryLibV1,
        validationLibV1: deployed.validationLibV1
      }
    }, coverKey)

    await network.provider.send('evm_increaseTime', [1 * HOURS])

    await deployed.dai.approve(vault.address, initialLiquidity)
    await deployed.npm.approve(vault.address, minStakeToReport)
    await vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd: minStakeToReport,
      referralCode: key.toBytes32('')
    })
  })

  it('correctly update product when accessed by cover creator', async () => {
    await network.provider.send('evm_increaseTime', [1 * HOURS])

    await deployed.cover.updateProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      productStatus: '1',
      efficiency: '10000'
    })
  })

  it('reverts when tried to update a retired product', async () => {
    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('retired-product'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    })

    await deployed.cover.updateProduct({
      coverKey,
      productKey: key.toBytes32('retired-product'),
      info,
      productStatus: '2',
      efficiency: '10000'
    })

    await deployed.cover.updateProduct({
      coverKey,
      productKey: key.toBytes32('retired-product'),
      info,
      productStatus: '1',
      efficiency: '10000'
    }).should.be.rejectedWith('Product retired or deleted')
  })

  it('reverts when tried to update a deleted product', async () => {
    await deployed.cover.addProduct({
      coverKey,
      productKey: key.toBytes32('deleted-product'),
      info,
      requiresWhitelist,
      productStatus: '1',
      efficiency: '10000'
    })

    await deployed.cover.updateProduct({
      coverKey,
      productKey: key.toBytes32('deleted-product'),
      info,
      productStatus: '0',
      efficiency: '10000'
    })

    await deployed.cover.updateProduct({
      coverKey,
      productKey: key.toBytes32('deleted-product'),
      info,
      productStatus: '1',
      efficiency: '10000'
    }).should.be.rejectedWith('Product retired or deleted')
  })

  it('reverts when efficiency is invalid', async () => {
    await deployed.cover.updateProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      productStatus: '1',
      efficiency: '0'
    }).should.be.rejectedWith('Invalid efficiency')

    await deployed.cover.updateProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      productStatus: '1',
      efficiency: '10001'
    }).should.be.rejectedWith('Invalid efficiency')
  })

  it('reverts when status is invalid', async () => {
    await deployed.cover.updateProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      productStatus: '3',
      efficiency: '10000'
    }).should.be.rejectedWith('Invalid product status')
  })

  it('reverts when protocol is paused', async () => {
    await deployed.protocol.pause()

    await deployed.cover.updateProduct({
      coverKey,
      productKey: key.toBytes32('test'),
      info,
      productStatus: '1',
      efficiency: '10000'
    }).should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.unpause()
  })
})
