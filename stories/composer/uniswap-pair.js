const { deployer } = require('../../util')

const deploySeveral = async (cache, pairInfo) => {
  const contracts = []

  for (let i = 0; i < pairInfo.length; i++) {
    const { token0, token1 } = pairInfo[i]

    const contract = await deployer.deploy(cache, 'FakeUniswapPair', token0, token1)
    contracts.push(contract)
  }

  return contracts
}

const at = async (address) => {
  const fakePair = await ethers.getContractFactory('FakeUniswapPair')
  return await fakePair.attach(address)
}

module.exports = { deploySeveral, at }
