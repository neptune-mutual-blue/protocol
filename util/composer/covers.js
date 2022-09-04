const { ethers } = require('ethers')
const { covers, products } = require('../../examples')
const ipfs = require('../ipfs')
const rest = (time) => new Promise((resolve) => setTimeout(resolve, time))

const createCovers = async (payload) => {
  const { intermediate, cache, contracts } = payload
  const { npm, stakingContract, cover } = contracts

  await intermediate(cache, npm, 'approve', cover.address, ethers.constants.MaxUint256)
  await intermediate(cache, npm, 'approve', stakingContract.address, ethers.constants.MaxUint256)

  for (const i in covers) {
    const info = covers[i]
    await addCover(payload, info)
    await rest(200)
  }

  for (const i in products) {
    const info = products[i]
    await addProduct(payload, info)
  }
}

const addCover = async (payload, info) => {
  const { intermediate, cache, contracts } = payload
  const { cover } = contracts

  const { key, leverage, supportsProducts } = info
  const { minReportingStake, reportingPeriod, stakeWithFees, reassurance, cooldownPeriod, claimPeriod, pricingFloor, pricingCeiling, requiresWhitelist, reassuranceRate, vault } = info
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
    reassuranceRate.toString(),
    leverage.toString()
  ]

  await intermediate(cache, cover, 'addCover', key, hashBytes32, vault.name, vault.symbol, supportsProducts, requiresWhitelist, values)
  await rest(100)
}

const addProduct = async (payload, info) => {
  const { intermediate, cache, contracts } = payload
  const { cover } = contracts

  const { coverKey, productKey, requiresWhitelist, capitalEfficiency } = info
  const hashBytes32 = await ipfs.write(info)

  const status = 1

  const values = [
    status,
    capitalEfficiency
  ]

  await intermediate(cache, cover, 'addProduct', coverKey, productKey, hashBytes32, requiresWhitelist, values)
}

module.exports = { createCovers }
