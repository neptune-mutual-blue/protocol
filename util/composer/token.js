const hre = require('hardhat')
const { deployer, helper } = require('..')
const { getNetworkInfo } = require('../network')
const erc20 = require('../contract-helper/erc20')
const faucet = require('../contract-helper/faucet')
const { ethers } = hre

const supportedNetworks = [31337]

const sendTransfers = async (contract) => {
  const [owner, alice, bob, chris, david, emily, franklin, george, harry, isabel, john, kimberly, lewis] = await ethers.getSigners() // eslint-disable-line

  await contract.connect(owner).mint(helper.ether(100_000_000_000_000_000_000_000_000))

  await contract.transfer(alice.address, helper.ether(1_000_000_000))
  await contract.transfer(bob.address, helper.ether(2_000_000_000))
  await contract.transfer(chris.address, helper.ether(3_000_000_000))
  await contract.transfer(david.address, helper.ether(2_000_000_000))
  await contract.transfer(emily.address, helper.ether(2_000_000_000))
  await contract.transfer(franklin.address, helper.ether(2_000_000_000))
  await contract.transfer(george.address, helper.ether(2_000_000_000))
  await contract.transfer(harry.address, helper.ether(2_000_000_000))
  await contract.transfer(isabel.address, helper.ether(2_000_000_000))
  await contract.transfer(john.address, helper.ether(2_000_000_000))
  await contract.transfer(kimberly.address, helper.ether(2_000_000_000))
  await contract.transfer(lewis.address, helper.ether(2_000_000_000))
}

const deployOrGetFromConfig = async (cache, tokens) => {
  const contracts = []

  const network = await getNetworkInfo()

  for (const i in tokens) {
    const { name, symbol, supply } = tokens[i]
    const tokenAt = (network?.deployedTokens || {})[symbol]

    if (tokenAt) {
      console.info('The token', symbol, 'was not deployed but picked up from the network config')

      const token = await erc20.getInstance(tokenAt)

      if (['DAI', 'cDai', 'aToken', 'NPM'].indexOf(symbol) === -1) {
        await faucet.request(token)
      }

      contracts.push(token)
      continue
    }

    // if (supportedNetworks.indexOf(hre.network.config.chainId) === -1) {
    //   throw new Error(`Can't deploy ${symbol} on this network.`)
    // }

    const contract = await deployer.deploy(cache, 'FakeToken', `Fake ${name}`, symbol, supply || helper.ether(1_000_000))
    hre.network.name === 'hardhat' && sendTransfers(contract)

    contracts.push(contract)
  }

  return contracts
}

const at = async (address) => {
  const token = await ethers.getContractFactory('FakeToken')
  return token.attach(address)
}

const compose = async (cache) => {
  const list = [
    { name: 'Neptune Mutual Token', symbol: 'NPM' },
    { name: 'Dai', symbol: 'DAI' },
    { name: 'Clearpool Token', symbol: 'CPOOL' },
    { name: 'Huobi Token', symbol: 'HT' },
    { name: 'OKB Token', symbol: 'OKB' },
    { name: 'SUPRA Token', symbol: 'SUPRA' },
    { name: 'BMC Token', symbol: 'BMC' },
    { name: 'XT Token', symbol: 'XT' },
    { name: 'aToken', symbol: 'aToken' },
    { name: 'cDai', symbol: 'cDai' }
  ]

  const [npm, dai, cpool, ht, okb, supra, bmc, xt, aToken, cDai] = await deployOrGetFromConfig(cache, list)

  list.find(x => x.symbol === 'NPM').instance = npm
  list.find(x => x.symbol === 'DAI').instance = dai
  list.find(x => x.symbol === 'CPOOL').instance = cpool
  list.find(x => x.symbol === 'HT').instance = ht
  list.find(x => x.symbol === 'OKB').instance = okb
  list.find(x => x.symbol === 'SUPRA').instance = supra
  list.find(x => x.symbol === 'BMC').instance = bmc
  list.find(x => x.symbol === 'XT').instance = xt
  list.find(x => x.symbol === 'aToken').instance = aToken
  list.find(x => x.symbol === 'cDai').instance = cDai

  return { npm, dai, cpool, ht, okb, supra, bmc, xt, aToken, cDai, tokenInfo: list }
}

module.exports = { deploySeveral: deployOrGetFromConfig, at, compose }
