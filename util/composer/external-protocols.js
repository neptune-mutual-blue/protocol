const hre = require('hardhat')
const fakesComposer = require('./fakes')
const { getNetworkInfo } = require('../network')

/**
 * Initializes all contracts
 * @return {Promise<ExternalProtocols>}
 */
const getExternalProtocols = async (cache, tokens) => {
  const network = await getNetworkInfo()

  let router = network?.uniswapV2Like?.addresses?.router
  let factory = network?.uniswapV2Like?.addresses?.factory
  let aaveLendingPool = network?.aave?.addresses?.lendingPool
  let compoundDaiDelegator = network?.compound?.dai?.delegator

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

    if (!compoundDaiDelegator) {
      compoundDaiDelegator = fakes.compound.daiDelegator.address
    }
  }

  return {
    router,
    factory,
    aaveLendingPool,
    compoundDaiDelegator
  }
}

module.exports = { getExternalProtocols }
