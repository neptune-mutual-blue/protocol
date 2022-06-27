/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const { helper, deployer, key } = require('../../../util')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Store: get uint values', () => {
  let store

  before(async () => {
    store = await deployer.deploy(cache, 'Store')
  })

  it('must correctly get the stored uint values', async () => {
    const keys = [key.toBytes32('test:uint1'), key.toBytes32('test:uint2')]

    const values = [
      ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString()),
      ethers.BigNumber.from(helper.getRandomNumber(10000000, 100000000).toString())
    ]

    for (const i in keys) {
      await store.setUint(keys[i], values[i])
    }

    const result = await store.getUintValues(keys)

    for (const i in result) {
      result[i].should.equal(values[i])
    }
  })
})
