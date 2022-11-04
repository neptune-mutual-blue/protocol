const hre = require('hardhat')
const { deployer, helper } = require('..')
const { getNetworkInfo } = require('../network')
const erc20 = require('../contract-helper/erc20')
const faucet = require('../contract-helper/faucet')
const { ethers } = hre

const supportedNetworks = [31337]

const sendTransfers = async (contract, decimals) => {
  const [owner, alice, bob, chris, david, emily, franklin, george, harry, isabel, john, kimberly, lewis] = await ethers.getSigners() // eslint-disable-line

  await contract.connect(owner).mint(helper.ether(100_000_000_000, decimals))

  await contract.transfer(alice.address, helper.ether(1_000_000_000, decimals))
  await contract.transfer(bob.address, helper.ether(2_000_000_000, decimals))
  await contract.transfer(chris.address, helper.ether(3_000_000_000, decimals))
  await contract.transfer(david.address, helper.ether(2_000_000_000, decimals))
  await contract.transfer(emily.address, helper.ether(2_000_000_000, decimals))
  await contract.transfer(franklin.address, helper.ether(2_000_000_000, decimals))
  await contract.transfer(george.address, helper.ether(2_000_000_000, decimals))
  await contract.transfer(harry.address, helper.ether(2_000_000_000, decimals))
  await contract.transfer(isabel.address, helper.ether(2_000_000_000, decimals))
  await contract.transfer(john.address, helper.ether(2_000_000_000, decimals))
  await contract.transfer(kimberly.address, helper.ether(2_000_000_000, decimals))
  await contract.transfer(lewis.address, helper.ether(2_000_000_000, decimals))
}

const deployOrGetFromConfig = async (cache, tokens) => {
  const contracts = []

  const network = await getNetworkInfo()

  for (const i in tokens) {
    const { name, symbol, supply, decimals } = tokens[i]
    const tokenAt = (network?.deployedTokens || {})[symbol]

    if (tokenAt) {
      console.info('The token', symbol, 'was not deployed but picked up from the network config')

      const token = await erc20.getInstance(tokenAt)

      if (['USDC', 'cStablecoin', 'aToken', 'NPM'].indexOf(symbol) === -1) {
        await faucet.request(token)
      }

      contracts.push(token)
      continue
    }

    if (supportedNetworks.indexOf(hre.network.config.chainId) > -1) {
      const contract = await deployer.deploy(cache, 'FakeToken', `Fake ${name}`, symbol, supply || helper.ether(800_000_000, decimals), decimals)
      hre.network.name === 'hardhat' && sendTransfers(contract, decimals)

      contracts.push(contract)
    }
  }

  return contracts
}

const at = async (address) => {
  const token = await ethers.getContractFactory('FakeToken')
  return token.attach(address)
}

const compose = async (cache) => {
  const list = [
    { name: 'Neptune Mutual Token', symbol: 'NPM', decimals: 18 },
    { name: 'USDC', symbol: 'USDC', decimals: helper.STABLECOIN_DECIMALS },
    { name: 'Crystalpool Token', symbol: 'CRPOOL', decimals: 18 },
    { name: 'Huobi-Wan Token', symbol: 'HWT', decimals: 18 },
    { name: 'Ob1-Ex', symbol: 'OBK', decimals: 18 },
    { name: 'Sabre Oracles', symbol: 'SABRE', decimals: 18 },
    { name: 'Bb8 Exchange', symbol: 'BEC', decimals: 18 },
    { name: 'XD Token', symbol: 'XD', decimals: 18 },
    { name: 'aToken', symbol: 'aToken', decimals: 18 },
    { name: 'cStablecoin', symbol: 'cStablecoin', decimals: 18 }
  ]

  const [npm, stablecoin, crpool, hwt, obk, sabre, bec, xd, aToken, cStablecoin] = await deployOrGetFromConfig(cache, list)

  list.find(x => x.symbol === 'NPM').instance = npm
  list.find(x => x.symbol === 'USDC').instance = stablecoin
  list.find(x => x.symbol === 'CRPOOL').instance = crpool
  list.find(x => x.symbol === 'HWT').instance = hwt
  list.find(x => x.symbol === 'OBK').instance = obk
  list.find(x => x.symbol === 'SABRE').instance = sabre
  list.find(x => x.symbol === 'BEC').instance = bec
  list.find(x => x.symbol === 'XD').instance = xd
  list.find(x => x.symbol === 'aToken').instance = aToken
  list.find(x => x.symbol === 'cStablecoin').instance = cStablecoin

  return { npm, stablecoin, crpool, hwt, obk, sabre, bec, xd, aToken, cStablecoin, tokenInfo: list }
}

module.exports = { deploySeveral: deployOrGetFromConfig, at, compose }
