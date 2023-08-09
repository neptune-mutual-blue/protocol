/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, key } = require('../../../../util')
const composer = require('../../../../util/composer')
const { deployDependencies } = require('./deps')
const DAYS = 86400
const PRECISION = helper.STABLECOIN_DECIMALS

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Cover: deleteCover', () => {
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

  const info = key.toBytes32('info')

  const args = {
    coverKey,
    info,
    tokenName: 'POD',
    tokenSymbol: 'POD',
    supportsProducts: false,
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
  }

  beforeEach(async () => {
    deployed = await deployDependencies()

    await deployed.npm.approve(deployed.cover.address, stakeWithFee)
    await deployed.stablecoin.approve(deployed.cover.address, initialReassuranceAmount)
    await deployed.cover.addCover(args)
  })

  it('must allow to delete a cover', async () => {
    await deployed.coverUpdate.deleteCover(coverKey)
  })

  it('must reject if accessed by anyone else but cover manager', async () => {
    const [, bob] = await ethers.getSigners()
    await deployed.coverUpdate.connect(bob).deleteCover(coverKey).should.be.rejectedWith('Forbidden')
  })

  it('reverts if cover does not exist', async () => {
    await deployed.coverUpdate.deleteCover(coverKey)

    await deployed.coverUpdate.deleteCover(coverKey).should.be.rejectedWith('Cover does not exist')
  })

  it('reverts if there is liquidity in the vault', async () => {
    const npmStakeToAdd = helper.ether(300)
    const initialLiquidity = helper.ether(4000000, PRECISION)

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

    await deployed.stablecoin.approve(vault.address, initialLiquidity)
    await deployed.npm.approve(vault.address, npmStakeToAdd)
    await vault.addLiquidity({
      coverKey,
      amount: initialLiquidity,
      npmStakeToAdd,
      referralCode: key.toBytes32('')
    })

    await deployed.coverUpdate.deleteCover(coverKey).should.be.rejectedWith('Has liquidity')
  })
})
