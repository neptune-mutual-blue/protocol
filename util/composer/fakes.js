const { deployer } = require('..')

const deployAll = async (cache, tokens) => {
  const { stablecoin, cStablecoin, aToken } = tokens

  const router = await deployer.deploy(cache, 'FakeUniswapV2RouterLike')
  const pair = await deployer.deploy(cache, 'FakeUniswapV2PairLike', '0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002')
  const factory = await deployer.deploy(cache, 'FakeUniswapV2FactoryLike', pair.address)
  const lendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)
  const stablecoinDelegator = await deployer.deploy(cache, 'FakeCompoundStablecoinDelegator', stablecoin.address, cStablecoin.address)
  const priceOracle = await deployer.deploy(cache, 'FakePriceOracle')

  await stablecoin.addMinter(lendingPool.address, true)
  await aToken.addMinter(lendingPool.address, true)

  await stablecoin.addMinter(stablecoinDelegator.address, true)
  await cStablecoin.addMinter(stablecoinDelegator.address, true)

  return { router, pair, factory, priceOracle, aave: { lendingPool }, compound: { stablecoinDelegator } }
}

module.exports = { deployAll }
