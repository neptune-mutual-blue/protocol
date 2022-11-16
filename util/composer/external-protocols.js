const hre = require('hardhat')
const fakesComposer = require('./fakes')
const { getNetworkInfo } = require('../network')
const { zerox } = require('../helper')

/**
 * Initializes all contracts
 * @return {Promise<ExternalProtocols>}
 */
const getExternalProtocols = async (cache, tokens) => {
  const network = await getNetworkInfo()

  let router = network?.uniswapV2Like?.addresses?.router
  let factory = network?.uniswapV2Like?.addresses?.factory
  let priceOracle = network?.uniswapV2Like?.addresses?.npmPriceOracle
  let aaveLendingPool = network?.aave?.addresses?.lendingPool
  let compoundStablecoinDelegator = network?.compound?.stablecoin?.delegator

  if (hre.network.name === 'hardhat') {
    const fakes = await fakesComposer.deployAll(cache, tokens)

    if (!router) {
      router = fakes.router.address
    }

    if (!factory) {
      factory = fakes.factory.address
    }

    if (!aaveLendingPool) {
      aaveLendingPool = fakes.aave.lendingPool.address
    }

    if (!compoundStablecoinDelegator) {
      compoundStablecoinDelegator = fakes.compound.stablecoinDelegator.address
    }
  }

  if (!priceOracle) {
    priceOracle = zerox
  }

  return {
    router,
    factory,
    priceOracle,
    aaveLendingPool,
    compoundStablecoinDelegator
  }
}

module.exports = { getExternalProtocols }
