/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
require('chai').use(require('chai-as-promised')).use(require('chai-bignumber')(BigNumber)).should()
const { helper, deployer, key, storeUtil, ipfs, sample } = require('../util')

const coverKey = key.toBytes32('Compound Finance Cover')

describe('Protocol Initialization Stories', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
  let nep, assuranceToken, wxDai, store, storeKeyUtil, protoUtilV1, protocol, cover, stakingContract, assuranceContract, coverUtil, vaultFactory, transferLib, previous

  const getVault = async (coverKey) => {
    const vaultAddress = await storeUtil.getVaultAddress(store, coverKey)

    const Vault = await ethers.getContractFactory('Vault', {
      libraries: {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        CoverUtilV1: coverUtil.address,
        NTransferUtilV2: transferLib.address
      }
    })

    const vault = await Vault.attach(vaultAddress)
    return vault
  }

  before(async () => {
    store = await deployer.deploy('FakeStore')

    nep = await deployer.deploy('FakeToken', 'Neptune Mutual Token', 'NEP', helper.ether(10000000))
    wxDai = await deployer.deploy('FakeToken', 'Wrapped Dai', 'WXDAI', helper.ether(10000000))

    storeKeyUtil = await deployer.deploy('StoreKeyUtil')
    transferLib = await deployer.deploy('NTransferUtilV2')

    protoUtilV1 = await deployer.deployWithLibraries('ProtoUtilV1', {
      StoreKeyUtil: storeKeyUtil.address
    })

    coverUtil = await deployer.deployWithLibraries('CoverUtilV1', {
      StoreKeyUtil: storeKeyUtil.address,
      ProtoUtilV1: protoUtilV1.address
    })
  })

  it('protocol was deployed', async () => {
    protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address,
      nep.address,
      treasury,
      assuranceVault
    )

    protocol.address.should.not.be.empty
    protocol.address.should.not.equal(helper.zerox)
  })

  it('staking contract was deployed', async () => {
    stakingContract = await deployer.deployWithLibraries('CoverStake', {
      StoreKeyUtil: storeKeyUtil.address,
      ProtoUtilV1: protoUtilV1.address,
      CoverUtilV1: coverUtil.address,
      NTransferUtilV2: transferLib.address
    }, store.address)

    await protocol.addContract(key.CNAME_KEYS.COVER_STAKE, stakingContract.address)
  })

  it('assurance contract was deployed', async () => {
    assuranceContract = await deployer.deployWithLibraries('CoverAssurance', {
      StoreKeyUtil: storeKeyUtil.address,
      ProtoUtilV1: protoUtilV1.address,
      CoverUtilV1: coverUtil.address,
      NTransferUtilV2: transferLib.address
    }, store.address)

    await protocol.addContract(key.CNAME_KEYS.COVER_ASSURANCE, assuranceContract.address)
  })

  it('cover contract was deployed', async () => {
    cover = await deployer.deployWithLibraries('Cover',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        CoverUtilV1: coverUtil.address,
        NTransferUtilV2: transferLib.address
      },
      store.address,
      wxDai.address,
      key.toBytes32('WXDAI')
    )

    cover.address.should.not.be.empty
    cover.address.should.not.equal(helper.zerox)

    await protocol.addContract(key.CNAME_KEYS.COVER, cover.address)
  })

  it('vault factory contract was deployed', async () => {
    vaultFactory = await deployer.deployWithLibraries('VaultFactory',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address,
        CoverUtilV1: coverUtil.address,
        NTransferUtilV2: transferLib.address
      }
    )

    vaultFactory.address.should.not.be.empty
    vaultFactory.address.should.not.equal(helper.zerox)

    await protocol.addContract(key.CNAME_KEYS.VAULT_FACTORY, vaultFactory.address)
  })

  it('a new cover `Compound Finance Cover` was created', async () => {
    const info = await ipfs.write(sample.info)

    // console.info(`https://ipfs.infura.io/ipfs/${ipfs.toIPFShash(info)}`)

    assuranceToken = await deployer.deploy('FakeToken', 'CMP', 'CMP', helper.ether(1000000000))

    const vault = await getVault(coverKey)
    const assuranceVault = await storeUtil.getAssuranceVaultAddress(store)
    const stakeWithFee = helper.ether(10000)
    const initialAssuranceAmount = helper.ether(10)
    const initialLiquidity = helper.ether(10)

    await nep.approve(stakingContract.address, stakeWithFee)
    await assuranceToken.approve(assuranceContract.address, initialAssuranceAmount)
    await wxDai.approve(cover.address, initialLiquidity)

    previous = {
      wxDaiBalance: (await wxDai.balanceOf(vault.address)).toString(),
      assuranceTokenBalance: (await assuranceToken.balanceOf(assuranceVault)).toString()
    }

    await cover.addCover(coverKey, info, stakeWithFee, assuranceToken.address, initialAssuranceAmount, initialLiquidity)
  })

  it('corretness rule: xDai should\'ve been correctly added to the vault', async () => {
    const vault = await getVault(coverKey)
    const balance = await wxDai.balanceOf(vault.address)

    const expected = helper.add(previous.wxDaiBalance, helper.ether(10))
    balance.should.equal(expected)

    previous.wxDaiBalance = expected
  })

  it('corretness rule: assurance token should\'ve been correctly transferred to the assurance vault', async () => {
    const vault = await storeUtil.getAssuranceVaultAddress(store)

    const balance = await assuranceToken.balanceOf(vault)

    const expected = helper.add(previous.assuranceTokenBalance, helper.ether(10))
    balance.should.equal(expected)

    previous.assuranceTokenBalance = expected
  })

  it('xDai liquidity was added again', async () => {
    const liquidity = helper.ether(1000)
    const vault = await getVault(coverKey)

    await wxDai.approve(vault.address, liquidity)
    await vault.addLiquidity(coverKey, liquidity)

    const expected = helper.add(previous.assuranceTokenBalance, liquidity)

    const balance = await wxDai.balanceOf(vault.address)
    balance.should.equal(expected)

    previous.wxDaiBalance = expected
  })

  it('correctness rule: pods should match the number of tokens deposited', async () => {
    const pod = await getVault(coverKey)
    const [owner] = await ethers.getSigners()

    const pods = await pod.balanceOf(owner.address)
    pods.should.equal(previous.wxDaiBalance.toString())
  })

  it('assurance token allocation was increased', async () => {
    const [owner] = await ethers.getSigners()
    const liquidity = helper.ether(10000)
    const vault = await storeUtil.getAssuranceVaultAddress(store)

    await assuranceToken.approve(assuranceContract.address, liquidity)
    await assuranceContract.addAssurance(coverKey, owner.address, liquidity)

    const expected = helper.add(previous.assuranceTokenBalance, liquidity)

    const balance = await assuranceToken.balanceOf(vault)

    balance.should.equal(expected)

    previous.assuranceTokenBalance = expected
  })
})
