/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { helper, key, ipfs, sample } = require('../../util')
const composer = require('../../util/composer')
const PRECISION = helper.STABLECOIN_DECIMALS

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

    const fetchedAddress = await contracts.store.getAddress(key.PROTOCOL.CNS.CORE)
    fetchedAddress.should.equal(contracts.protocol.address)
  })

  it('staking contract was correctly deployed', async () => {
    contracts.stakingContract.address.should.not.be.empty
    contracts.stakingContract.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER_STAKE))
    fetchedAddress.should.equal(contracts.stakingContract.address)
  })

  it('reassurance contract was correctly deployed', async () => {
    contracts.reassuranceContract.address.should.not.be.empty
    contracts.reassuranceContract.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER_REASSURANCE))
    fetchedAddress.should.equal(contracts.reassuranceContract.address)
  })

  it('cover contract was correctly deployed', async () => {
    contracts.cover.address.should.not.be.empty
    contracts.cover.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER))
    fetchedAddress.should.equal(contracts.cover.address)
  })

  it('vault factory contract was deployed', async () => {
    contracts.vaultFactory.address.should.not.be.empty
    contracts.vaultFactory.address.should.not.equal(helper.zerox)

    const fetchedAddress = await contracts.store.getAddress(key.qualifyBytes32(key.PROTOCOL.CNS.COVER_VAULT_FACTORY))
    fetchedAddress.should.equal(contracts.vaultFactory.address)
  })

  it('a new cover `Compound Finance Cover` was created', async () => {
    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    const initialReassuranceAmount = helper.ether(1000000, PRECISION)
    const stakeWithFee = helper.ether(10000)
    const minStakeToReport = helper.ether(250)
    const reportingPeriod = 7 * DAYS
    const cooldownPeriod = 1 * DAYS
    const claimPeriod = 7 * DAYS
    const floor = helper.percentage(7)
    const ceiling = helper.percentage(45)
    const reassuranceRate = helper.percentage(50)

    await contracts.npm.approve(contracts.stakingContract.address, stakeWithFee)
    await contracts.reassuranceToken.approve(contracts.cover.address, initialReassuranceAmount)

    previous = {
      daiBalance: '0',
      reassuranceTokenBalance: (await contracts.reassuranceToken.balanceOf(contracts.reassuranceContract.address)).toString()
    }

    await contracts.cover.addCover({
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
      leverageFactor: '1'
    })
  })

  it('corretness rule: DAI should be correctly added to the vault', async () => {
    const npmToStake = helper.ether(300)
    const initialLiquidity = helper.ether(4000000, PRECISION)

    const vault = await composer.vault.getVault(contracts, coverKey)
    await contracts.dai.approve(contracts.cover.address, initialLiquidity)

    await contracts.dai.approve(vault.address, initialLiquidity)
    await contracts.npm.approve(vault.address, npmToStake)

    await vault.addLiquidity(coverKey, initialLiquidity, npmToStake, key.toBytes32(''))
    const balance = await vault.getStablecoinBalanceOf()

    const expected = helper.add(previous.daiBalance, initialLiquidity)
    balance.toString().should.equal(expected.toString())

    previous.daiBalance = expected
  })

  it('correctness rule: pods should match the number of tokens deposited', async () => {
    const pod = await composer.vault.getVault(contracts, coverKey)
    const [owner] = await ethers.getSigners()

    const pods = await pod.balanceOf(owner.address)

    helper.ether(helper.weiToEther(pods), PRECISION).toString().should.equal(previous.daiBalance.toString())
  })

  it('corretness rule: reassurance token should\'ve been correctly transferred to the reassurance vault', async () => {
    const balance = await contracts.reassuranceToken.balanceOf(contracts.reassuranceContract.address)

    const expected = helper.add(previous.reassuranceTokenBalance, helper.ether(1000000, PRECISION))

    balance.toString().should.equal(expected.toString())

    previous.reassuranceTokenBalance = expected
  })

  it('DAI liquidity was added again', async () => {
    const liquidity = helper.ether(50000, PRECISION)
    const npmToStake = helper.ether(250)

    const vault = await composer.vault.getVault(contracts, coverKey)

    await contracts.dai.approve(vault.address, liquidity)
    await contracts.npm.approve(vault.address, npmToStake)

    await vault.addLiquidity(coverKey, liquidity, npmToStake, key.toBytes32(''))

    const expected = helper.add(previous.daiBalance, liquidity)

    const balance = await vault.getStablecoinBalanceOf()

    balance.toString().should.equal(expected.toString())

    previous.daiBalance = expected
  })

  it('correctness rule: pods should be less than the number of tokens deposited', async () => {
    const pod = await composer.vault.getVault(contracts, coverKey)
    const [owner] = await ethers.getSigners()

    const pods = await pod.balanceOf(owner.address)

    parseInt(helper.ether(helper.weiToEther(pods), PRECISION)).should.be.lte(parseInt(previous.daiBalance))
  })

  it('reassurance token allocation was increased', async () => {
    const liquidity = helper.ether(20000, PRECISION)

    await contracts.reassuranceToken.approve(contracts.reassuranceContract.address, liquidity)
    await contracts.reassuranceContract.addReassurance(coverKey, helper.randomAddress(), liquidity)

    const expected = helper.add(previous.reassuranceTokenBalance, liquidity)

    const balance = await contracts.reassuranceToken.balanceOf(contracts.reassuranceContract.address)

    balance.toString().should.equal(expected.toString())

    previous.reassuranceTokenBalance = expected
  })

  it('the vault generated a fictional income', async () => {
    const liquidity = helper.ether(1, PRECISION)
    const vault = await composer.vault.getVault(contracts, coverKey)

    // Directly transferring DAI to simulate an income earned from external source(s)
    await contracts.dai.transfer(vault.address, liquidity)
    // await vault.addLiquidity(coverKey, liquidity, key.toBytes32(''))

    const expected = helper.add(previous.daiBalance, liquidity)

    // const balance = await contracts.dai.balanceOf(vault.address)
    const balance = await vault.getStablecoinBalanceOf()

    balance.toString().should.equal(expected.toString())

    previous.daiBalance = expected
  })

  it('DAI liquidity was added once again', async () => {
    const liquidity = helper.ether(1000, PRECISION)
    const npmToStake = helper.ether(250)

    const vault = await composer.vault.getVault(contracts, coverKey)

    await contracts.dai.approve(vault.address, liquidity)
    await contracts.npm.approve(vault.address, npmToStake)

    await vault.addLiquidity(coverKey, liquidity, npmToStake, key.toBytes32(''))

    const expected = helper.add(previous.daiBalance, liquidity)

    const balance = await vault.getStablecoinBalanceOf()

    balance.toString().should.equal(expected.toString())

    previous.daiBalance = expected
  })

  it('correctness rule: pods should now be less than the number of tokens deposited', async () => {
    const pod = await composer.vault.getVault(contracts, coverKey)
    const [owner] = await ethers.getSigners()

    const pods = await pod.balanceOf(owner.address)
    parseInt(helper.ether(helper.weiToEther(pods), PRECISION)).should.be.lessThan(parseInt(previous.daiBalance))
  })
})
