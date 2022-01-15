const hre = require('hardhat')
const { deployer, helper } = require('..')
const { getNetworkInfo } = require('../network')
const erc20 = require('../contract-helper/erc20')

const sendTransfers = async (contract) => {
  const [owner, alice, bob, chris, david, emily, franklin, george, harry, isabel, john, kimberly, lewis] = await ethers.getSigners() // eslint-disable-line

  await contract.mint(owner.address, helper.ether(100_000_000_000_000_000_000_000_000))
  await contract.transfer(alice.address, helper.ether(10_000_000))
  await contract.transfer(bob.address, helper.ether(20_000_000))
  await contract.transfer(chris.address, helper.ether(30_000_000))
  await contract.transfer(david.address, helper.ether(1_000_000))
  await contract.transfer(emily.address, helper.ether(1_000_000))
  await contract.transfer(franklin.address, helper.ether(1_000_000))
  await contract.transfer(george.address, helper.ether(100_000_000))
  await contract.transfer(harry.address, helper.ether(1_000_000))
  await contract.transfer(isabel.address, helper.ether(1_000_000))
  await contract.transfer(john.address, helper.ether(100_000_000))
  await contract.transfer(kimberly.address, helper.ether(1_000_000))
  await contract.transfer(lewis.address, helper.ether(1_000_000))
}

const deploySeveral = async (cache, tokens) => {
  const contracts = []

  const network = await getNetworkInfo()

  for (const i in tokens) {
    const { name, symbol, supply } = tokens[i]
    const tokenAt = (network?.deployedTokens || {})[symbol]

    if (tokenAt) {
      console.info('The token', symbol, 'was not deployed but picked up from the network config')
      contracts.push(await erc20.getInstance(tokenAt))
      continue
    }

    const contract = await deployer.deploy(cache, 'FakeToken', name, symbol, supply || helper.ether(1_000_000))
    hre.network.name === 'hardhat' && sendTransfers(contract)

    contracts.push(contract)
  }

  return contracts
}

const at = async (address) => {
  const token = await ethers.getContractFactory('FakeToken')
  return token.attach(address)
}

module.exports = { deploySeveral, at }
