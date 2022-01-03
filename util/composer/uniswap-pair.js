const { deployer } = require('..')

const deploySeveral = async (cache, pairInfo) => {
  const contracts = []

  for (const i in pairInfo) {
    const { token0, token1 } = pairInfo[i]

    const contract = await deployer.deploy(cache, 'FakeUniswapPair', token0, token1)
    contracts.push(contract)
  }

  return contracts
}

const at = async (address) => {
  const fakePair = await ethers.getContractFactory('FakeUniswapPair')
  return fakePair.attach(address)
}

module.exports = { deploySeveral, at }
