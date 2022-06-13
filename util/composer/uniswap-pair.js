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

  for (const i in pairInfo) {
    const { token0, token1, name } = pairInfo[i]

    const router = await uniswap.getRouter(routerAt)
    const factory = await uniswap.getFactory(factoryAt)

    let pair = await factory.getPair(token0.address, token1.address)

    if (pair === zerox) {
      console.log(`Attempting to provide ${name} liquidity to a Uniswap-like DEX`)

      const t0d = await token0.decimals()
      const t1d = await token1.decimals()

      await erc20.approve(token0.address, routerAt, owner, ethers.BigNumber.from(ether(1000, parseInt(t0d))))
      await erc20.approve(token1.address, routerAt, owner, ethers.BigNumber.from(ether(2000, parseInt(t1d))))

      const deadline = moment(new Date()).add(1, 'month').unix()
      const tx = await router.addLiquidity(token0.address, token1.address, ether(1000, t0d), ether(2000, t1d), ether(1000, t0d), ether(2000, t1d), owner.address, deadline)
      await tx.wait()
    }

    pair = await factory.getPair(token0.address, token1.address)
    console.info(name, 'pair:', pair)

    const instance = await uniswap.getPair(pair)
    pairInfo[i].pairInstance = instance

    pairs.push(instance)
  }

  return [pairs, pairInfo]
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

    const contract = await deployer.deploy(cache, 'FakeUniswapPair', token0.address, token1.address)
    pairInfo[i].pairInstance = contract

    contracts.push(contract)
  }

  return [contracts, pairInfo]
}

const at = async (address) => {
  const fakePair = await ethers.getContractFactory('FakeUniswapPair')
  return fakePair.attach(address)
}

const compose = async (cache, tokens) => {
  const { npm, dai, crpool, hwt, obk, sabre, bec, xd } = tokens

  return deploySeveral(cache, [
    { token0: npm, token1: dai, name: 'NPM/DAI' },
    { token0: crpool, token1: dai, name: 'CRPOOL/DAI' },
    { token0: hwt, token1: dai, name: 'HWT/DAI' },
    { token0: obk, token1: dai, name: 'OBK/DAI' },
    { token0: sabre, token1: dai, name: 'SABRE/DAI' },
    { token0: bec, token1: dai, name: 'BEC/DAI' },
    { token0: xd, token1: dai, name: 'XD/DAI' }
  ])
}

module.exports = { deploySeveral, at, compose }
