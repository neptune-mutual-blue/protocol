const { ethers } = require('ethers')
const { covers } = require('../../examples/covers')
const ipfs = require('../ipfs')
const rest = (time) => new Promise((resolve) => setTimeout(resolve, time))

const createCovers = async (payload) => {
  const { intermediate, cache, contracts } = payload
  const { dai, npm, reassuranceContract, stakingContract, cover } = contracts

  await intermediate(cache, npm, 'approve', cover.address, ethers.constants.MaxUint256)
  await intermediate(cache, dai, 'approve', reassuranceContract.address, ethers.constants.MaxUint256)
  await intermediate(cache, npm, 'approve', stakingContract.address, ethers.constants.MaxUint256)

  for (const i in covers) {
    const info = covers[i]
    await create(payload, info)
    await rest(200)
  }
}

const create = async (payload, info) => {
  const { intermediate, cache, contracts } = payload
  const { dai, cover } = contracts

  const { key } = info
  const { minReportingStake, reportingPeriod, stakeWithFees, reassurance, cooldownPeriod, claimPeriod, pricingFloor, pricingCeiling, requiresWhitelist, reassuranceRate } = info
  const hashBytes32 = await ipfs.write(info)

  const values = [
    stakeWithFees.toString(),
    reassurance.toString(),
    minReportingStake.toString(),
    reportingPeriod.toString(),
    cooldownPeriod.toString(),
    claimPeriod.toString(),
    pricingFloor.toString(),
    pricingCeiling.toString(),
    reassuranceRate.toString()
  ]

  await intermediate(cache, cover, 'addCover', key, hashBytes32, dai.address, requiresWhitelist, values)
  await rest(100)
  await intermediate(cache, cover, 'deployVault', key)
}

module.exports = { createCovers }
