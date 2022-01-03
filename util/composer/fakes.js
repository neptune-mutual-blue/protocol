const { deployer } = require('..')

const deployAll = async (cache) => {
  const router = await deployer.deploy(cache, 'FakeUniswapV2RouterLike')

  return { router }
}

module.exports = { deployAll }
