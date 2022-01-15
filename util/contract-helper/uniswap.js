const { ethers } = require('hardhat')
const routerAbi = require('../../abis/IUniswapV2RouterLike.json')
const factoryAbi = require('../../abis/IUniswapV2FactoryLike.json')
const pairAbi = require('../../abis/IUniswapV2PairLike.json')

const getRouter = async (routerAt, signer) => {
  const [owner] = await ethers.getSigners()
  return new ethers.Contract(routerAt, routerAbi, signer || owner)
}

const getFactory = async (factoryAt, signer) => {
  const [owner] = await ethers.getSigners()
  return new ethers.Contract(factoryAt, factoryAbi, signer || owner)
}

const getPair = async (pairAt, signer) => {
  const [owner] = await ethers.getSigners()
  return new ethers.Contract(pairAt, pairAbi, signer || owner)
}

module.exports = { getRouter, getFactory, getPair }
