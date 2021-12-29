/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
const { helper, key, storeUtil, ipfs, sample } = require('../util')
const composer = require('./composer')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const DAYS = 86400

const coverKey = key.toBytes32('Compound Finance Cover')

/**
 * @type {Contracts}
 */
let contracts = {}

describe('Protocol Initialization Stories', () => {
  let previous

  before(async () => {
    contracts = await composer.initializer.initialize(true)
  })

  it('protocol was correctly deployed', async () => {
    contracts.protocol.address.should.not.be.empty
    contracts.protocol.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.toBytes32(key.CNS.CORE))
    fetchedAddress.should.equal(contracts.protocol.address)
  })

  it('staking contract was correctly deployed', async () => {
    contracts.stakingContract.address.should.not.be.empty
    contracts.stakingContract.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.CNS.COVER_STAKE))
    fetchedAddress.should.equal(contracts.stakingContract.address)
  })

  it('reassurance contract was correctly deployed', async () => {
    contracts.reassuranceContract.address.should.not.be.empty
    contracts.reassuranceContract.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.CNS.COVER_REASSURANCE))
    fetchedAddress.should.equal(contracts.reassuranceContract.address)
  })

  it('provision contract was correctly deployed', async () => {
    contracts.provisionContract.address.should.not.be.empty
    contracts.provisionContract.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.NS.COVER_PROVISION))
    fetchedAddress.should.equal(contracts.provisionContract.address)
  })

  it('cover contract was correctly deployed', async () => {
    contracts.cover.address.should.not.be.empty
    contracts.cover.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.CNS.COVER))
    fetchedAddress.should.equal(contracts.cover.address)
  })

  it('vault factory contract was deployed', async () => {
    contracts.vaultFactory.address.should.not.be.empty
    contracts.vaultFactory.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.CNS.COVER_VAULT_FACTORY))
    fetchedAddress.should.equal(contracts.vaultFactory.address)
  })

  it('a new cover `Compound Finance Cover` was created', async () => {
    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const stakeWithFee = helper.ether(10000)
    const initialReassuranceAmount = helper.ether(1000000)
    const initialLiquidity = helper.ether(4000000)
    const reportingPeriod = 7 * DAYS

    await contracts.npm.approve(contracts.stakingContract.address, stakeWithFee)
    await contracts.reassuranceToken.approve(contracts.reassuranceContract.address, initialReassuranceAmount)
    await contracts.wxDai.approve(contracts.cover.address, initialLiquidity)

    const vault = await composer.vault.getVault(contracts, coverKey)
    const reassuranceVault = await storeUtil.getReassuranceVaultAddress(contracts.store)

    previous = {
      wxDaiBalance: (await contracts.wxDai.balanceOf(vault.address)).toString(),
      reassuranceTokenBalance: (await contracts.reassuranceToken.balanceOf(reassuranceVault)).toString()
    }

    await contracts.cover.addCover(coverKey, info, reportingPeriod, stakeWithFee, contracts.reassuranceToken.address, initialReassuranceAmount, initialLiquidity)
  })

  it('corretness rule: xDai should\'ve been correctly added to the vault', async () => {
    const vault = await composer.vault.getVault(contracts, coverKey)
    const balance = await contracts.wxDai.balanceOf(vault.address)

    const expected = helper.add(previous.wxDaiBalance, helper.ether(4000000))
    balance.should.equal(expected)

    previous.wxDaiBalance = expected
  })

  it('corretness rule: reassurance token should\'ve been correctly transferred to the reassurance vault', async () => {
    const vault = await storeUtil.getReassuranceVaultAddress(contracts.store)

    const balance = await contracts.reassuranceToken.balanceOf(vault)

    const expected = helper.add(previous.reassuranceTokenBalance, helper.ether(1000000))
    balance.should.equal(expected)

    previous.reassuranceTokenBalance = expected
  })

  it('xDai liquidity was added again', async () => {
    const liquidity = helper.ether(50000)
    const vault = await composer.vault.getVault(contracts, coverKey)

    await contracts.wxDai.approve(vault.address, liquidity)
    await vault.addLiquidity(coverKey, liquidity)

    const expected = helper.add(previous.wxDaiBalance, liquidity)

    const balance = await contracts.wxDai.balanceOf(vault.address)
    balance.should.equal(expected)

    previous.wxDaiBalance = expected
  })

  it('correctness rule: pods should match the number of tokens deposited', async () => {
    const pod = await composer.vault.getVault(contracts, coverKey)
    const [owner] = await ethers.getSigners()

    const pods = await pod.balanceOf(owner.address)
    pods.should.equal(previous.wxDaiBalance.toString())
  })

  it('reassurance token allocation was increased', async () => {
    const [owner] = await ethers.getSigners()
    const liquidity = helper.ether(20000)
    const vault = await storeUtil.getReassuranceVaultAddress(contracts.store)

    await contracts.reassuranceToken.approve(contracts.reassuranceContract.address, liquidity)
    await contracts.reassuranceContract.addReassurance(coverKey, owner.address, liquidity)

    const expected = helper.add(previous.reassuranceTokenBalance, liquidity)

    const balance = await contracts.reassuranceToken.balanceOf(vault)

    balance.should.equal(expected)

    previous.reassuranceTokenBalance = expected
  })

  it('the vault generated a fictional income', async () => {
    const liquidity = helper.ether(1)
    const vault = await composer.vault.getVault(contracts, coverKey)

    // Directly transferring xDai to simulate an income earned from external source(s)
    await contracts.wxDai.transfer(vault.address, liquidity)
    // await vault.addLiquidity(coverKey, liquidity)

    const expected = helper.add(previous.wxDaiBalance, liquidity)

    const balance = await contracts.wxDai.balanceOf(vault.address)
    balance.should.equal(expected)

    previous.wxDaiBalance = expected
  })

  it('xDai liquidity was added once again', async () => {
    const liquidity = helper.ether(1000)
    const vault = await composer.vault.getVault(contracts, coverKey)

    await contracts.wxDai.approve(vault.address, liquidity)
    await vault.addLiquidity(coverKey, liquidity)

    const expected = helper.add(previous.wxDaiBalance, liquidity)

    const balance = await contracts.wxDai.balanceOf(vault.address)
    balance.should.equal(expected)

    previous.wxDaiBalance = expected
  })

  it('correctness rule: pods should now be less than the number of tokens deposited', async () => {
    const pod = await composer.vault.getVault(contracts, coverKey)
    const [owner] = await ethers.getSigners()

    const pods = await pod.balanceOf(owner.address)
    parseInt(pods.toString()).should.be.lessThan(parseInt(previous.wxDaiBalance.toString()))
  })
})
