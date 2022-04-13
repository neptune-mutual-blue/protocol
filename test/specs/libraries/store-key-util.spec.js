/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { deployer, key, helper } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('StoreKeyUtil: setStringByKey', () => {
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

  it('must set value correctly', async () => {
    const testkey = key.toBytes32('testkey')
    const testvalue = 'testvalue'

    await mockContract.setStringByKey(testkey, testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey = key.toBytes32('')
    const testvalue = 'testvalue'

    await mockContract.setStringByKey(testkey, testvalue)
      .should.be.rejectedWith('Invalid key')
  })
})

describe('StoreKeyUtil: getStringByKey', () => {
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
    const testkey = key.toBytes32('testkey')
    const testvalue = 'testvalue'

    await mockContract.setStringByKey(testkey, testvalue)
    const result = await mockContract.getStringByKey(testkey)
    result.should.equal(testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey = key.toBytes32('')

    await mockContract.getStringByKey(testkey)
      .should.be.rejectedWith('Invalid key')
  })
})

describe('StoreKeyUtil: setAddressByKey', () => {
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

  it('must set value correctly', async () => {
    const testkey = key.toBytes32('testkey')
    const testvalue = helper.zero1

    await mockContract.setAddressByKey(testkey, testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey = key.toBytes32('')
    const testvalue = helper.zero1

    await mockContract.setAddressByKey(testkey, testvalue)
      .should.be.rejectedWith('Invalid key')
  })
})

describe('StoreKeyUtil: getAddressByKey', () => {
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
    const testkey = key.toBytes32('testkey')
    const testvalue = helper.zero1

    await mockContract.setAddressByKey(testkey, testvalue)
    const result = await mockContract.getAddressByKey(testkey)
    result.should.equal(testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey = key.toBytes32('')

    await mockContract.getAddressByKey(testkey)
      .should.be.rejectedWith('Invalid key')
  })
})

describe('StoreKeyUtil: deleteAddressByKey', () => {
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

  it('must delete value correctly', async () => {
    const testkey = key.toBytes32('testkey')
    const testvalue = helper.zero1

    await mockContract.setAddressByKey(testkey, testvalue)
    await mockContract.deleteAddressByKey(testkey)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey = key.toBytes32('')

    await mockContract.deleteAddressByKey(testkey)
      .should.be.rejectedWith('Invalid key')
  })
})

describe('StoreKeyUtil: setAddressArrayByKeys', () => {
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

  it('must set value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('')
    const testkey3 = key.toBytes32('testkey3')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
      .should.be.rejectedWith('Invalid key(s)')
  })
})

describe('StoreKeyUtil: getAddressArrayByKeys (2 keys)', () => {
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

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
    const result = await mockContract['getAddressArrayByKeys(bytes32,bytes32)'](testkey1, testkey2)
    result.should.deep.equal([testvalue])
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('')

    await mockContract['getAddressArrayByKeys(bytes32,bytes32)'](testkey1, testkey2)
      .should.be.rejectedWith('Invalid key(s)')
  })
})

describe('StoreKeyUtil: getAddressArrayByKeys (3 keys)', () => {
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

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
    const result = await mockContract['getAddressArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3)
    result.should.deep.equal([testvalue])
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('')
    const testkey3 = key.toBytes32('testkey3')

    await mockContract['getAddressArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3)
      .should.be.rejectedWith('Invalid key(s)')
  })
})

describe('StoreKeyUtil: setAddressBooleanByKeys', () => {
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

  it('must set value correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const account = helper.zero1
    const testvalue = true

    await mockContract.setAddressBooleanByKeys(testkey1, testkey2, testkey3, account, testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('')
    const testkey3 = key.toBytes32('testkey3')
    const account = helper.zero1
    const testvalue = true

    await mockContract.setAddressBooleanByKeys(testkey1, testkey2, testkey3, account, testvalue)
      .should.be.rejectedWith('Invalid key(s)')
  })
})

describe('StoreKeyUtil: getAddressBooleanByKeys', () => {
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
    const account = helper.zero1
    const testvalue = true

    await mockContract.setAddressBooleanByKeys(testkey1, testkey2, testkey3, account, testvalue)
    const result = await mockContract.getAddressBooleanByKeys(testkey1, testkey2, testkey3, account)
    result.should.equal(testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('')
    const testkey3 = key.toBytes32('testkey3')
    const account = helper.zero1

    await mockContract.getAddressBooleanByKeys(testkey1, testkey2, testkey3, account)
      .should.be.rejectedWith('Invalid key(s)')
  })
})

describe('StoreKeyUtil: countAddressArrayByKey', () => {
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

  it('must count address correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
    const result = await mockContract['countAddressArrayByKey(bytes32)'](testkey1)
    result.should.equal(1)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('')

    await mockContract['countAddressArrayByKey(bytes32)'](testkey1)
      .should.be.rejectedWith('Invalid key')
  })
})

describe('StoreKeyUtil: countAddressArrayByKeys (2 keys)', () => {
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

  it('must count address correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
    const result = await mockContract['countAddressArrayByKeys(bytes32,bytes32)'](testkey1, testkey2)
    result.should.equal(1)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('')

    await mockContract['countAddressArrayByKeys(bytes32,bytes32)'](testkey1, testkey2)
      .should.be.rejectedWith('Invalid key(s)')
  })
})

describe('StoreKeyUtil: countAddressArrayByKeys (3 keys)', () => {
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

  it('must count address correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
    const result = await mockContract['countAddressArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3)
    result.should.equal(1)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('')
    const testkey3 = key.toBytes32('testkey3')

    await mockContract['countAddressArrayByKeys(bytes32,bytes32,bytes32)'](testkey1, testkey2, testkey3)
      .should.be.rejectedWith('Invalid key(s)')
  })
})

describe('StoreKeyUtil: deleteAddressArrayByKey', () => {
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

  it('must delete address correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
    await mockContract['deleteAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('')
    const testvalue = helper.zero1

    await mockContract['deleteAddressArrayByKey(bytes32,address)'](testkey1, testvalue)
      .should.be.rejectedWith('Invalid key')
  })
})

describe('StoreKeyUtil: deleteAddressArrayByKeys (2 keys)', () => {
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

  it('must delete address correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
    await mockContract['deleteAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('')
    const testvalue = helper.zero1

    await mockContract['deleteAddressArrayByKeys(bytes32,bytes32,address)'](testkey1, testkey2, testvalue)
      .should.be.rejectedWith('Invalid key(s)')
  })
})

describe('StoreKeyUtil: deleteAddressArrayByKeys (3 keys)', () => {
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

  it('must delete address correctly', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('testkey2')
    const testkey3 = key.toBytes32('testkey3')
    const testvalue = helper.zero1

    await mockContract['setAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
    await mockContract['deleteAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey1 = key.toBytes32('testkey1')
    const testkey2 = key.toBytes32('')
    const testkey3 = key.toBytes32('testkey3')
    const testvalue = helper.zero1

    await mockContract['deleteAddressArrayByKeys(bytes32,bytes32,bytes32,address)'](testkey1, testkey2, testkey3, testvalue)
      .should.be.rejectedWith('Invalid key(s)')
  })
})

describe('StoreKeyUtil: getBytes32ByKey', () => {
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

  it('must count address correctly', async () => {
    const testkey = key.toBytes32('testkey')
    const testvalue = key.toBytes32('testvalue')

    await mockContract.setBytes32ByKey(testkey, testvalue)
    const result = await mockContract.getBytes32ByKey(testkey)
    result.should.equal(testvalue)
  })

  it('reverts invalid value is passed as key', async () => {
    const testkey = key.toBytes32('')

    await mockContract.getBytes32ByKey(testkey)
      .should.be.rejectedWith('Invalid key')
  })
})
