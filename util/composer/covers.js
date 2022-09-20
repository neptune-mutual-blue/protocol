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
  const { minStakeToReport, reportingPeriod, stakeWithFee, reassurance, cooldownPeriod, claimPeriod, pricingFloor, pricingCeiling, requiresWhitelist, reassuranceRate, vault } = info
  const ipfsHash = await ipfs.write(info)

  await intermediate(cache, cover, 'addCover', {
    coverKey: key,
    info: ipfsHash,
    tokenName: vault.name,
    tokenSymbol: vault.symbol,
    supportsProducts,
    requiresWhitelist,
    stakeWithFee,
    initialReassuranceAmount: reassurance,
    minStakeToReport,
    reportingPeriod,
    cooldownPeriod,
    claimPeriod,
    floor: pricingFloor,
    ceiling: pricingCeiling,
    reassuranceRate,
    leverageFactor: leverage
  })

  await rest(100)
}

const addProduct = async (payload, info) => {
  const { intermediate, cache, contracts } = payload
  const { cover } = contracts

  const { coverKey, productKey, requiresWhitelist, capitalEfficiency } = info
  const ipfsHash = await ipfs.write(info)

  const status = 1

  await intermediate(cache, cover, 'addProduct', {
    coverKey,
    productKey,
    info: ipfsHash,
    requiresWhitelist,
    productStatus: status,
    efficiency: capitalEfficiency
  })
}

module.exports = { createCovers }
