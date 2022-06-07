/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('StoreKeyUtil Library', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  describe('StoreKeyUtil: addUintByKey', () => {
    it('must add value correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = helper.ether(1)

      await mockContract.addUintByKey(testkey, testvalue)
    })
  })

  describe('StoreKeyUtil: countAddressArrayByKey', () => {
    it('must count address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
      const result = await mockContract['countAddressArrayByKey(bytes32)'](testkey1)
      result.should.equal(1)
    })
  })

  describe('StoreKeyUtil: countAddressArrayByKeys (2 keys)', () => {
    it('must count address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
      const result = await mockContract['countAddressArrayByKeys(bytes32,bytes32)'](testkey1, testkey2)
      result.should.equal(1)
    })
  })

  describe('StoreKeyUtil: countAddressArrayByKeys (3 keys)', () => {
    it('must count address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testkey3 = key.toBytes32('testkey3')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
      const result = await mockContract['countAddressArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3)
      result.should.equal(1)
    })
  })

  describe('StoreKeyUtil: deleteAddressByKey', () => {
    it('must delete value correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = helper.zero1

      await mockContract.setAddressByKey(testkey, testvalue)
      await mockContract.deleteAddressByKey(testkey)
    })
  })

  describe('StoreKeyUtil: deleteAddressByKeys (3 keys)', () => {
    it('must delete address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testkey3 = key.toBytes32('testkey3')

      await mockContract['deleteAddressByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3)
    })
  })

  describe('StoreKeyUtil: deleteAddressArrayByIndexByKey', () => {
    it('must delete address correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = helper.zero1
      const testindex = 0

      await mockContract.setAddressArrayByKey(testkey, testvalue)
      await mockContract.deleteAddressArrayByIndexByKey(testkey, testindex)
    })

    it('reverts when invalid value is passed as index', async () => {
      const testkey = key.toBytes32('testkey')
      const testindex = 3

      await mockContract.deleteAddressArrayByIndexByKey(testkey, testindex)
        .should.be.rejectedWith('Invalid index')
    })
  })

  describe('StoreKeyUtil: deleteAddressArrayByIndexByKeys (2 keys)', () => {
    it('must delete address array correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testindex = 0
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
      await mockContract['deleteAddressArrayByIndexByKeys(bytes32,bytes32,uint256)'](testkey1, testkey2, testindex)
    })

    it('reverts when invalid value is passed as index', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testindex = 2

      await mockContract['deleteAddressArrayByIndexByKeys(bytes32,bytes32,uint256)'](testkey1, testkey2, testindex)
        .should.be.rejectedWith('Invalid index')
    })
  })

  describe('StoreKeyUtil: deleteAddressArrayByIndexByKeys (3 keys)', () => {
    it('must delete address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testkey3 = key.toBytes32('testkey3')
      const testindex = 0
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
      await mockContract['deleteAddressArrayByIndexByKeys(bytes32,bytes32,bytes32,uint256)'](testkey1, testkey2, testkey3, testindex)
    })
  })

  describe('StoreKeyUtil: deleteAddressArrayByKey', () => {
    it('must delete address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
      await mockContract['deleteAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
    })
  })

  describe('StoreKeyUtil: deleteAddressArrayByKeys (2 keys)', () => {
    it('must delete address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
      await mockContract['deleteAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
    })
  })

  describe('StoreKeyUtil: deleteAddressArrayByKeys (3 keys)', () => {
    it('must delete address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testkey3 = key.toBytes32('testkey3')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
      await mockContract['deleteAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
    })
  })

  describe('StoreKeyUtil: deleteBoolByKey', () => {
    it('must delete address correctly', async () => {
      const testkey = key.toBytes32('testkey')

      await mockContract.deleteBoolByKey(testkey)
    })
  })

  describe('StoreKeyUtil: deleteBytes32ByKey', () => {
    it('must delete address correctly', async () => {
      const testkey = key.toBytes32('testkey')

      await mockContract.deleteBytes32ByKey(testkey)
    })
  })

  describe('StoreKeyUtil: deleteBytes32ByKeys', () => {
    it('must delete address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')

      await mockContract.deleteBytes32ByKeys(testkey1, testkey2)
    })
  })

  describe('StoreKeyUtil: deleteUintByKey', () => {
    it('must delete value correctly', async () => {
      const testkey = key.toBytes32('testkey')

      await mockContract.deleteUintByKey(testkey)
    })
  })

  describe('StoreKeyUtil: getAddressByKey', () => {
    it('must get value correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = helper.zero1

      await mockContract.setAddressByKey(testkey, testvalue)
      const result = await mockContract.getAddressByKey(testkey)
      result.should.equal(testvalue)
    })
  })

  describe('StoreKeyUtil: getAddressArrayByKey', () => {
    it('must get value correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
      const result = await mockContract['getAddressArrayByKey(bytes32)'](testkey1)
      result.should.deep.equal([testvalue])
    })
  })

  describe('StoreKeyUtil: getAddressArrayByKeys (2 keys)', () => {
    it('must get value correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
      const result = await mockContract['getAddressArrayByKeys(bytes32,bytes32)'](testkey1, testkey2)
      result.should.deep.equal([testvalue])
    })
  })

  describe('StoreKeyUtil: getAddressArrayByKeys (3 keys)', () => {
    it('must get value correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testkey3 = key.toBytes32('testkey3')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
      const result = await mockContract['getAddressArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3)
      result.should.deep.equal([testvalue])
    })
  })

  describe('StoreKeyUtil: getAddressBooleanByKey', () => {
    it('must get value correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const account = helper.zero1
      const testvalue = true

      await mockContract['setAddressBooleanByKey(bytes32,address,bool)'](testkey1, account, testvalue)
      const result = await mockContract['getAddressBooleanByKey(bytes32,address)'](testkey1, account)
      result.should.equal(testvalue)
    })
  })

  describe('StoreKeyUtil: getAddressBooleanByKeys', () => {
    it('must get value correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testkey3 = key.toBytes32('testkey3')
      const account = helper.zero1
      const testvalue = true

      await mockContract['setAddressBooleanByKeys(bytes32,bytes32,bytes32,address,bool)'](testkey1, testkey2, testkey3, account, testvalue)
      const result = await mockContract['getAddressBooleanByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, account)
      result.should.equal(testvalue)
    })
  })

  describe('StoreKeyUtil: getBoolByKey', () => {
    it('must get address correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = true

      await mockContract.setBoolByKey(testkey, testvalue)
      const result = await mockContract.getBoolByKey(testkey)
      result.should.equal(testvalue)
    })
  })

  describe('StoreKeyUtil: getBytes32ByKey', () => {
    it('must get address correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = key.toBytes32('testvalue')

      await mockContract.setBytes32ByKey(testkey, testvalue)
      const result = await mockContract.getBytes32ByKey(testkey)
      result.should.equal(testvalue)
    })
  })

  describe('StoreKeyUtil: getStringByKey', () => {
    it('must get value correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = 'testvalue'

      await mockContract.setStringByKey(testkey, testvalue)
      const result = await mockContract.getStringByKey(testkey)
      result.should.equal(testvalue)
    })
  })

  describe('StoreKeyUtil: getUintByKey', () => {
    it('must get value correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = helper.ether(1)

      await mockContract.setUintByKey(testkey, testvalue)
      const result = await mockContract.getUintByKey(testkey)
      result.should.be.equal(testvalue)
    })
  })

  describe('StoreKeyUtil: setAddressByKey', () => {
    it('must set value correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = helper.zero1

      await mockContract.setAddressByKey(testkey, testvalue)
    })
  })

  describe('StoreKeyUtil: setAddressArrayByKeys', () => {
    it('must set value correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testkey3 = key.toBytes32('testkey3')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
    })
  })

  describe('StoreKeyUtil: setAddressBooleanByKey', () => {
    it('must set value correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const account = helper.zero1
      const testvalue = true

      await mockContract['setAddressBooleanByKey(bytes32,address,bool)'](testkey1, account, testvalue)
    })
  })

  describe('StoreKeyUtil: setAddressBooleanByKeys', () => {
    it('must set value correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testkey3 = key.toBytes32('testkey3')
      const account = helper.zero1
      const testvalue = true

      await mockContract['setAddressBooleanByKeys(bytes32,bytes32,bytes32,address,bool)'](testkey1, testkey2, testkey3, account, testvalue)
    })
  })

  describe('StoreKeyUtil: setAddressArrayByKey', () => {
    it('must set address correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testvalue = helper.zero1

      await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
    })
  })

  describe('StoreKeyUtil: setBoolByKey', () => {
    it('must set boolean correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = true

      await mockContract.setBoolByKey(testkey, testvalue)
    })
  })

  describe('StoreKeyUtil: setBoolByKeys', () => {
    it('must set boolean correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testaccount = helper.zero1
      const testvalue = true

      await mockContract['setBoolByKeys(bytes32,address,bool)'](testkey, testaccount, testvalue)
    })
  })

  describe('StoreKeyUtil: setBytes32ByKey', () => {
    it('must set address correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = key.toBytes32('testvalue')

      await mockContract.setBytes32ByKey(testkey, testvalue)
    })
  })

  describe('StoreKeyUtil: setStringByKey', () => {
    it('must set value correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = 'testvalue'

      await mockContract.setStringByKey(testkey, testvalue)
    })
  })

  describe('StoreKeyUtil: setUintByKey', () => {
    it('must set value correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = helper.ether(1)

      await mockContract.setUintByKey(testkey, testvalue)
    })
  })

  describe('StoreKeyUtil: setUintByKeys', () => {
    it('must set value correctly', async () => {
      const testkey1 = key.toBytes32('testkey1')
      const testkey2 = key.toBytes32('testkey2')
      const testaccount = helper.zero1
      const testvalue = helper.ether(1)

      await mockContract['setUintByKeys(bytes32,bytes32,address,uint256)'](testkey1, testkey2, testaccount, testvalue)
    })
  })

  describe('StoreKeyUtil: subtractUintByKey', () => {
    it('must subtract value correctly', async () => {
      const testkey = key.toBytes32('testkey')
      const testvalue = helper.ether(1)

      await mockContract.addUintByKey(testkey, testvalue)
      await mockContract.subtractUintByKey(testkey, testvalue)
    })
  })
})

describe('StoreKeyUtil: getAddressArrayItemPositionByKey', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, helper.zerox)
    await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
    const result = await mockContract['getAddressArrayItemPositionByKey(bytes32,address)'](testkey1, testvalue)
    result.should.equal(2)
  })
})

describe('StoreKeyUtil: getAddressArrayItemPositionByKeys (2 keys)', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, helper.zerox)
    await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
    const result = await mockContract['getAddressArrayItemPositionByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
    result.should.equal(2)
  })
})

describe('StoreKeyUtil: getAddressArrayItemPositionByKeys (3 keys)', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, helper.zerox)
    await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
    const result = await mockContract['getAddressArrayItemPositionByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
    result.should.equal(2)
  })
})

describe('StoreKeyUtil: getAddressArrayItemByIndexByKey', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testvalue = helper.zero1
    const testindex = 1

    await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, helper.zerox)
    await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
    const result = await mockContract['getAddressArrayItemByIndexByKey(bytes32,uint256)'](testkey1, testindex)
    result.should.equal(testvalue)
  })

  it('reverts when invalid value is passed as index', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testindex = 2

    await mockContract['getAddressArrayItemByIndexByKey(bytes32,uint256)'](testkey1, testindex)
      .should.be.rejectedWith('Invalid index')
  })
})

describe('StoreKeyUtil: getAddressArrayItemByIndexByKeys (2 keys)', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testvalue = helper.zero1
    const testindex = 1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, helper.zerox)
    await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
    const result = await mockContract['getAddressArrayItemByIndexByKeys(bytes32,bytes32,uint256)'](testkey1, testkey2, testindex)
    result.should.equal(testvalue)
  })

  it('reverts when invalid value is passed as index', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testindex = 2

    await mockContract['getAddressArrayItemByIndexByKeys(bytes32,bytes32,uint256)'](testkey1, testkey2, testindex)
      .should.be.rejectedWith('Invalid index')
  })
})

describe('StoreKeyUtil: getAddressArrayItemByIndexByKeys (3 keys)', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const testvalue = helper.zero1
    const testindex = 1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, helper.zerox)
    await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
    const result = await mockContract['getAddressArrayItemByIndexByKeys(bytes32,bytes32,bytes32,uint256)'](testkey1, testkey2, testkey3, testindex)
    result.should.equal(testvalue)
  })

  it('reverts when invalid value is passed as index', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const testindex = 2

    await mockContract['getAddressArrayItemByIndexByKeys(bytes32,bytes32,bytes32,uint256)'](testkey1, testkey2, testkey3, testindex)
      .should.be.rejectedWith('Invalid index')
  })
})

describe('StoreKeyUtil: getBytes32ArrayItemPositionByKey', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testvalue = helper.randomPrivateKey()

    await mockContract['setBytes32ArrayByKey(bytes32,bytes32)'](testkey1, key.toBytes32(''))
    await mockContract['setBytes32ArrayByKey(bytes32,bytes32)'](testkey1, testvalue)
    const result = await mockContract['getBytes32ArrayItemPositionByKey(bytes32,bytes32)'](testkey1, testvalue)
    result.should.equal(2)
  })
})

describe('StoreKeyUtil: getBytes32ArrayItemPositionByKeys (2 keys)', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testvalue = helper.randomPrivateKey()

    await mockContract['setBytes32ArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, key.toBytes32(''))
    await mockContract['setBytes32ArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testvalue)
    const result = await mockContract['getBytes32ArrayItemPositionByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testvalue)
    result.should.equal(2)
  })
})

describe('StoreKeyUtil: getBytes32ArrayItemPositionByKeys (3 keys)', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const testvalue = helper.randomPrivateKey()

    await mockContract['setBytes32ArrayByKeys(bytes32,bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3, key.toBytes32(''))
    await mockContract['setBytes32ArrayByKeys(bytes32,bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3, testvalue)
    const result = await mockContract['getBytes32ArrayItemPositionByKeys(bytes32,bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3, testvalue)
    result.should.equal(2)
  })
})

describe('StoreKeyUtil: getBytes32ArrayItemByIndexByKey', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testvalue = helper.randomPrivateKey()
    const testindex = 1

    await mockContract['setBytes32ArrayByKey(bytes32,bytes32)'](testkey1, key.toBytes32(''))
    await mockContract['setBytes32ArrayByKey(bytes32,bytes32)'](testkey1, testvalue)
    const result = await mockContract['getBytes32ArrayItemByIndexByKey(bytes32,uint256)'](testkey1, testindex)
    result.should.equal(testvalue)
  })

  it('reverts when invalid value is passed as index', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testindex = 2

    await mockContract['getBytes32ArrayItemByIndexByKey(bytes32,uint256)'](testkey1, testindex)
      .should.be.rejectedWith('Invalid index')
  })
})

describe('StoreKeyUtil: getBytes32ArrayItemByIndexByKeys (2 keys)', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testvalue = helper.randomPrivateKey()
    const testindex = 1

    await mockContract['setBytes32ArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, key.toBytes32(''))
    await mockContract['setBytes32ArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testvalue)
    const result = await mockContract['getBytes32ArrayItemByIndexByKeys(bytes32,bytes32,uint256)'](testkey1, testkey2, testindex)
    result.should.equal(testvalue)
  })

  it('reverts when invalid value is passed as index', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testindex = 2

    await mockContract['getBytes32ArrayItemByIndexByKeys(bytes32,bytes32,uint256)'](testkey1, testkey2, testindex)
      .should.be.rejectedWith('Invalid index')
  })
})

describe('StoreKeyUtil: getBytes32ArrayItemByIndexByKeys (3 keys)', () => {
  let deployed, mockContract

  before(async () => {
    deployed = await deployDependencies()
    mockContract = await deployer.deployWithLibraries(
      cache,
      'MockStoreKeyUtilUser',
      { StoreKeyUtil: deployed.storeKeyUtil.address },
      deployed.store.address
    )
    await deployed.store.setBool(key.qualifyMember(mockContract.address), true)
  })

  it('must get value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const testvalue = helper.randomPrivateKey()
    const testindex = 1

    await mockContract['setBytes32ArrayByKeys(bytes32,bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3, key.toBytes32(''))
    await mockContract['setBytes32ArrayByKeys(bytes32,bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3, testvalue)
    const result = await mockContract['getBytes32ArrayItemByIndexByKeys(bytes32,bytes32,bytes32,uint256)'](testkey1, testkey2, testkey3, testindex)
    result.should.equal(testvalue)
  })

  it('reverts when invalid value is passed as index', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const testindex = 2

    await mockContract['getBytes32ArrayItemByIndexByKeys(bytes32,bytes32,bytes32,uint256)'](testkey1, testkey2, testkey3, testindex)
      .should.be.rejectedWith('Invalid index')
  })
})
