/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: get address values', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly get the stored address values', async () => {
    const keys = [key.toBytes32('test:address1'), key.toBytes32('test:address2')]

    const values = [
      helper.randomAddress(),
      helper.randomAddress()
    ]

    for (const i in keys) {
      await store.setAddress(keys[i], values[i])
    }

    const result = await store.getAddressValues(keys)
    result.should.deep.equal(values)
  })
})
