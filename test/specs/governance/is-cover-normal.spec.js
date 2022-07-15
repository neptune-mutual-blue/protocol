/* eslint-disable no-unused-expressions */
const BigNumber = require('bignumber.js')
const { ethers } = require('hardhat')
const uuid = require('uuid')
const { deployer, key } = require('../../../util')
const { deployDependencies } = require('./deps')
const cache = null


require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe("Get all products in a cover is normal", ()=>{

   let deployed, coverKey

  before(async () => {
    deployed = await deployDependencies()
    coverKey = key.toBytes32('defi')
  })

  it("must return true if all products are normal", async () => {
    const [owner] = await ethers.getSigners()

    const coverStatus = await deployed.governance.connect(owner).isCoverNormal(coverKey);
    coverStatus.should.equal(true)
  })
})