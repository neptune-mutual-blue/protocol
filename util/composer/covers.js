const { ethers } = require('hardhat')
const { getNetworkInfo } = require('../network')
const { covers, products } = require('../../examples')
const ipfs = require('../ipfs')
const CHUNK_SIZE = 4

const rest = (time) => new Promise((resolve) => setTimeout(resolve, time))
const toChunks = (array, size) => Array(Math.ceil(array.length / size)).fill().map((_, index) => index * size).map(begin => array.slice(begin, begin + size))

const create = async (payload) => {
  const { intermediate, cache, contracts } = payload
  const { tokens, cover } = contracts

  await intermediate(cache, tokens.npm, 'approve', cover.address, ethers.constants.MaxUint256)
  await intermediate(cache, tokens.stablecoin, 'approve', cover.address, ethers.constants.MaxUint256)

  await addCovers(payload)
  await rest(200)
  await addProducts(payload)
}

const addCovers = async (payload) => {
  const { intermediate, cache, contracts } = payload
  const { cover } = contracts

  const network = await getNetworkInfo()
  const claimPeriod = network.cover.claimPeriod
  const cooldownPeriod = network.cover.cooldownPeriod
  const reportingPeriod = network.cover.reportingPeriod
  const { mainnet } = network

  if (covers.length > CHUNK_SIZE) {
    console.log('Total covers: %s. Breaking into to chunks of %s covers', covers.length, CHUNK_SIZE)
  }

  const chunks = toChunks(covers, CHUNK_SIZE)

  for (const chunk of chunks) {
    const args = await Promise.all(chunk.map(async (x) => {
      let arg = {
        info: await ipfs.write(x),
        ...x
      }

      if (mainnet === false) {
        arg = {
          ...arg,
          claimPeriod,
          cooldownPeriod,
          reportingPeriod
        }
      }

      return arg
    }))

    await intermediate(cache, cover, 'addCovers', args)
  }
}

const addProducts = async (payload) => {
  const { intermediate, cache, contracts } = payload
  const { cover } = contracts

  if (products.length > CHUNK_SIZE) {
    console.log('Total products: %s. Breaking into to chunks of %s products', products.length, CHUNK_SIZE)
  }

  const chunks = toChunks(products, CHUNK_SIZE)

  for (const chunk of chunks) {
    const args = await Promise.all(chunk.map(async (x) => {
      return {
        coverKey: x.coverKey,
        productKey: x.productKey,
        info: await ipfs.write(x),
        requiresWhitelist: x.requiresWhitelist,
        productStatus: '1',
        efficiency: x.efficiency
      }
    }))

    await intermediate(cache, cover, 'addProducts', args)
  }
}

module.exports = { create }
