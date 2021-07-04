/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
require('chai').use(require('chai-as-promised')).use(require('chai-bignumber')(BigNumber)).should()
const { helper, deployer, key, storeUtil, ipfs, sample } = require('../util')

describe('Constructor & Initializer', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
  let nep, store, storeKeyUtil, protoUtilV1

  beforeEach(async () => {
    store = await deployer.deploy('FakeStore')
    nep = await deployer.deploy('FakeToken', 'Neptune Mutual Token', 'NEP', helper.ether(10000))

    storeKeyUtil = await deployer.deploy('StoreKeyUtil')

    protoUtilV1 = await deployer.deployWithLibraries('ProtoUtilV1', {
      StoreKeyUtil: storeKeyUtil.address
    })
  })

  it('should deploy correctly', async () => {
    const protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(nep.address, treasury, assuranceVault)

    protocol.address.should.not.be.empty
    protocol.address.should.not.equal(helper.zerox)
  })

  it('should correctly set storage values', async () => {
    const protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(nep.address, treasury, assuranceVault)

    const sProtocolAddress = await store.getAddress(key.encodeKey(key.NS.CORE))
    sProtocolAddress.should.equal(protocol.address)

    const isProtocolAddress = await store.getBool(key.qualify(protocol.address))
    isProtocolAddress.should.be.true

    const sNEPAddress = await store.getAddress(key.encodeKey(key.NS.SETUP_NEP))
    sNEPAddress.should.equal(nep.address)

    const sBurner = await store.getAddress(key.encodeKey(key.NS.BURNER))
    sBurner.should.equal(helper.zero1)

    const sTreasury = await store.getAddress(key.encodeKey(key.NS.TREASURY))
    sTreasury.should.equal(treasury)

    const sAssuranceVault = await store.getAddress(key.encodeKey(key.NS.ASSURANCE_VAULT))
    sAssuranceVault.should.equal(assuranceVault)
  })

  it('should fail when zero address is provided as store', async () => {
    await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      helper.zerox
    ).should.be.revertedWith('Invalid Store')
  })

  it('should fail when zero address is provided as NEP', async () => {
    const protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(helper.zerox, treasury, assuranceVault).should.be.revertedWith('Invalid NEP')
  })

  it('should fail when zero address is provided as treasury', async () => {
    const protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(nep.address, helper.zerox, assuranceVault).should.be.revertedWith('Invalid Treasury')
  })

  it('should fail when zero address is provided as assurance vault', async () => {
    const protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(nep.address, treasury, helper.zerox).should.be.revertedWith('Invalid Vault')
  })
})

describe('Adding a New Protocol Contract', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
  let nep, store, protocol

  beforeEach(async () => {
    store = await deployer.deploy('FakeStore')
    nep = await deployer.deploy('FakeToken', 'Neptune Mutual Token', 'NEP', helper.ether(10000))

    const storeKeyUtil = await deployer.deploy('StoreKeyUtil')

    const protoUtilV1 = await deployer.deployWithLibraries('ProtoUtilV1', {
      StoreKeyUtil: storeKeyUtil.address
    })

    protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(nep.address, treasury, assuranceVault)
  })

  it('should correctly add a new contract', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), fakeCover)
  })

  it('should correctly set storage values', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), fakeCover)

    const sContractAddress = await store.getAddress(key.qualifyBytes32(key.NS.COVER))

    sContractAddress.should.equal(fakeCover)
  })
})

describe('Upgrading Protocol Contract(s)', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
  let nep, store, protocol

  beforeEach(async () => {
    store = await deployer.deploy('FakeStore')
    nep = await deployer.deploy('FakeToken', 'Neptune Mutual Token', 'NEP', helper.ether(10000))

    const storeKeyUtil = await deployer.deploy('StoreKeyUtil')

    const protoUtilV1 = await deployer.deployWithLibraries('ProtoUtilV1', {
      StoreKeyUtil: storeKeyUtil.address
    })

    protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(nep.address, treasury, assuranceVault)
  })

  it('should correctly upgrade a contract', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), fakeCover)

    const fakeCover2 = helper.randomAddress()
    await protocol.upgradeContract(key.toBytes32(key.NS.COVER), fakeCover, fakeCover2)
  })

  it('should fail when the previous address is incorrect', async () => {
    const fakeCover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), fakeCover)

    const fakeCover2 = helper.randomAddress()
    await protocol.upgradeContract(key.toBytes32(key.NS.COVER), helper.randomAddress(), fakeCover2)
      .should.be.revertedWith('Not a protocol member')
  })

  it('should correctly set storage values', async () => {
    const cover = helper.randomAddress()
    await protocol.addContract(key.toBytes32(key.NS.COVER), cover)

    let sContractAddress = await store.getAddress(key.qualifyBytes32(key.NS.COVER))

    sContractAddress.should.equal(cover)

    // ------- UPGRADE CONTRACT -------

    const cover2 = helper.randomAddress()
    await protocol.upgradeContract(key.toBytes32(key.NS.COVER), cover, cover2)

    sContractAddress = await store.getAddress(key.qualifyBytes32(key.NS.COVER))
    sContractAddress.should.equal(cover2)
  })
})

describe('Adding a New Protocol Member', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
  let nep, store, protocol

  beforeEach(async () => {
    store = await deployer.deploy('FakeStore')
    nep = await deployer.deploy('FakeToken', 'Neptune Mutual Token', 'NEP', helper.ether(10000))

    const storeKeyUtil = await deployer.deploy('StoreKeyUtil')

    const protoUtilV1 = await deployer.deployWithLibraries('ProtoUtilV1', {
      StoreKeyUtil: storeKeyUtil.address
    })

    protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(nep.address, treasury, assuranceVault)
  })

  it('should correctly add a new member', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)
  })

  it('should reject adding the same member twice', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)
    await protocol.addMember(fakeMember).should.be.revertedWith('Already exists')
  })

  it('should correctly set storage values', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)

    const isMember = await store.getBool(key.qualifyMember(fakeMember))
    isMember.should.be.true
  })
})

describe('Removing Protocol Member(s)', () => {
  const treasury = helper.randomAddress()
  const assuranceVault = helper.randomAddress()
  let nep, store, protocol

  beforeEach(async () => {
    store = await deployer.deploy('FakeStore')
    nep = await deployer.deploy('FakeToken', 'Neptune Mutual Token', 'NEP', helper.ether(10000))

    const storeKeyUtil = await deployer.deploy('StoreKeyUtil')

    const protoUtilV1 = await deployer.deployWithLibraries('ProtoUtilV1', {
      StoreKeyUtil: storeKeyUtil.address
    })

    protocol = await deployer.deployWithLibraries('Protocol',
      {
        StoreKeyUtil: storeKeyUtil.address,
        ProtoUtilV1: protoUtilV1.address
      },
      store.address
    )

    await store.setBool(key.qualify(protocol.address), true)
    await store.setBool(key.qualifyMember(protocol.address), true)

    await protocol.initialize(nep.address, treasury, assuranceVault)
  })

  it('should correctly remove a member', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)
    await protocol.removeMember(fakeMember)
  })

  it('should correctly set storage values', async () => {
    const fakeMember = helper.randomAddress()
    await protocol.addMember(fakeMember)

    let isMember = await store.getBool(key.qualifyMember(fakeMember))
    isMember.should.be.true

    await protocol.removeMember(fakeMember)

    isMember = await store.getBool(key.qualifyMember(fakeMember))
    isMember.should.be.false
  })
})
