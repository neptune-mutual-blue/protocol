const hre = require('hardhat')
const fakesComposer = require('./fakes')
const { getNetworkInfo } = require('../network')

/**
 * Initializes all contracts
 * @return {Promise<ExternalProtocols>}
 */
const getExternalProtocols = async (cache) => {
  const network = await getNetworkInfo()

  let router = network?.uniswapV2Like?.addresses?.router
  let factory = network?.uniswapV2Like?.addresses?.factory
  let aaveLendingPool = network?.aave?.addresses?.lendingPool

  if (hre.network.name === 'hardhat') {
    const fakes = await fakesComposer.deployAll(cache)

    if (!router) {
      router = fakes.router.address
    }

    if (!factory) {
      factory = fakes.factory.address
    }

    if (!aaveLendingPool) {
      aaveLendingPool = fakes.aave.lendingPool.address
    }
  }

  return {
    router,
    factory,
    aaveLendingPool
  }
}

module.exports = { getExternalProtocols }
