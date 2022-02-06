const { deployer } = require('..')

const deployAll = async (cache, tokens) => {
  const { dai, cDai, aToken } = tokens

  const router = await deployer.deploy(cache, 'FakeUniswapV2RouterLike')
  const pair = await deployer.deploy(cache, 'FakeUniswapV2PairLike', '0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002')
  const factory = await deployer.deploy(cache, 'FakeUniswapV2FactoryLike', pair.address)
  const lendingPool = await deployer.deploy(cache, 'FakeAaveLendingPool', aToken.address)
  const daiDelegator = await deployer.deploy(cache, 'FakeCompoundERC20Delegator', dai.address, cDai.address)

  return { router, pair, factory, aave: { lendingPool }, compound: { daiDelegator } }
}

module.exports = { deployAll }
