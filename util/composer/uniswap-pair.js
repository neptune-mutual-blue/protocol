const { ethers } = require('hardhat')
const moment = require('moment')
const { deployer } = require('..')
const { getNetworkInfo } = require('../network')
const uniswap = require('../contract-helper/uniswap')
const erc20 = require('../contract-helper/erc20')
const { zerox, ether } = require('../helper')

const createPairs = async (routerAt, factoryAt, pairInfo) => {
  const pairs = []
  const [owner] = await ethers.getSigners()

  const router = await uniswap.getRouter(routerAt)
  const factory = await uniswap.getFactory(factoryAt)

  for (const i in pairInfo) {
    const { token0, token1, name } = pairInfo[i]

    let pair = await factory.getPair(token0, token1)

    if (pair === zerox) {
      console.log(`Attempting to provide ${name} liquidity to a Uniswap-like DEX`)

      await erc20.approve(token0, routerAt)
      await erc20.approve(token1, routerAt)

      const deadline = moment(new Date()).add(1, 'month').unix()

      const tx = await router.addLiquidity(token0, token1, ether(1000), ether(2000), ether(1000), ether(2000), owner.address, deadline)
      await tx.wait()
    }

    pair = await factory.getPair(token0, token1)
    console.info(name, 'pair:', pair)

    pairs.push(await uniswap.getPair(pair))
  }

  return pairs
}

const deploySeveral = async (cache, pairInfo) => {
  const contracts = []

  const network = await getNetworkInfo()
  const router = network?.uniswapV2Like?.addresses?.router
  const factory = network?.uniswapV2Like?.addresses?.factory

  if (router) {
    return createPairs(router, factory, pairInfo)
  }

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
