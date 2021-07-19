/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
const { helper, key, storeUtil, ipfs, sample } = require('../util')
const composer = require('./composer')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const day = 86400

const coverKey = key.toBytes32('Compound Finance Cover')

/**
 * @type {Contracts}
 */
let contracts = {}

describe('Protocol Initialization Stories', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
  let previous

  before(async () => {
    contracts = await composer.initializer.initialize(treasury, assuranceVault)
  })

  it('protocol was correctly deployed', async () => {
    contracts.protocol.address.should.not.be.empty
    contracts.protocol.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.encodeKey(key.NS.CORE))
    fetchedAddress.should.equal(contracts.protocol.address)
  })

  it('staking contract was correctly deployed', async () => {
    contracts.stakingContract.address.should.not.be.empty
    contracts.stakingContract.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.NS.COVER_STAKE))
    fetchedAddress.should.equal(contracts.stakingContract.address)
  })

  it('assurance contract was correctly deployed', async () => {
    contracts.assuranceContract.address.should.not.be.empty
    contracts.assuranceContract.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.NS.COVER_ASSURANCE))
    fetchedAddress.should.equal(contracts.assuranceContract.address)
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

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.NS.COVER))
    fetchedAddress.should.equal(contracts.cover.address)
  })

  it('vault factory contract was deployed', async () => {
    contracts.vaultFactory.address.should.not.be.empty
    contracts.vaultFactory.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.NS.COVER_VAULT_FACTORY))
    fetchedAddress.should.equal(contracts.vaultFactory.address)
  })

  it('a new cover `Compound Finance Cover` was created', async () => {
    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const stakeWithFee = helper.ether(10000)
    const initialAssuranceAmount = helper.ether(1000000)
    const initialLiquidity = helper.ether(4000000)
    const reportingPeriod = 7 * day

    await contracts.nep.approve(contracts.stakingContract.address, stakeWithFee)
    await contracts.assuranceToken.approve(contracts.assuranceContract.address, initialAssuranceAmount)
    await contracts.wxDai.approve(contracts.cover.address, initialLiquidity)

    const vault = await composer.vault.getVault(contracts, coverKey)
    const assuranceVault = await storeUtil.getAssuranceVaultAddress(contracts.store)

    previous = {
      wxDaiBalance: (await contracts.wxDai.balanceOf(vault.address)).toString(),
      assuranceTokenBalance: (await contracts.assuranceToken.balanceOf(assuranceVault)).toString()
    }

    await contracts.cover.addCover(coverKey, info, reportingPeriod, stakeWithFee, contracts.assuranceToken.address, initialAssuranceAmount, initialLiquidity)
  })

  it('corretness rule: xDai should\'ve been correctly added to the vault', async () => {
    const vault = await composer.vault.getVault(contracts, coverKey)
    const balance = await contracts.wxDai.balanceOf(vault.address)

    const expected = helper.add(previous.wxDaiBalance, helper.ether(4000000))
    balance.should.equal(expected)

    previous.wxDaiBalance = expected
  })

  it('corretness rule: assurance token should\'ve been correctly transferred to the assurance vault', async () => {
    const vault = await storeUtil.getAssuranceVaultAddress(contracts.store)

    const balance = await contracts.assuranceToken.balanceOf(vault)

    const expected = helper.add(previous.assuranceTokenBalance, helper.ether(1000000))
    balance.should.equal(expected)

    previous.assuranceTokenBalance = expected
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

  it('assurance token allocation was increased', async () => {
    const [owner] = await ethers.getSigners()
    const liquidity = helper.ether(20000)
    const vault = await storeUtil.getAssuranceVaultAddress(contracts.store)

    await contracts.assuranceToken.approve(contracts.assuranceContract.address, liquidity)
    await contracts.assuranceContract.addAssurance(coverKey, owner.address, liquidity)

    const expected = helper.add(previous.assuranceTokenBalance, liquidity)

    const balance = await contracts.assuranceToken.balanceOf(vault)

    balance.should.equal(expected)

    previous.assuranceTokenBalance = expected
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
