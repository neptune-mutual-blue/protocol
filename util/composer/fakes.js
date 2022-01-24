const { deployer, helper } = require('..')

const deployAll = async (cache) => {
  const router = await deployer.deploy(cache, 'FakeUniswapV2RouterLike')
  const pair = await deployer.deploy(cache, 'FakeUniswapV2PairLike', helper.randomAddress(), helper.randomAddress())
  const factory = await deployer.deploy(cache, 'FakeUniswapV2FactoryLike', pair.address)

  return { router, pair, factory }
}

module.exports = { deployAll }
