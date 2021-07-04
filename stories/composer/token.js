const { deployer, helper } = require('../../util')

const deploySeveral = async (tokens) => {
  const contracts = []

  for (let i = 0; i < tokens.length; i++) {
    const { name, symbol, supply } = tokens[i]

    const contract = await deployer.deploy('FakeToken', name, symbol, supply || helper.ether(10000000000000000))
    contracts.push(contract)
  }

  return contracts
}

const at = async (address) => {
  const token = await ethers.getContractFactory('FakeToken')
  return await token.attach(address)
}

module.exports = { deploySeveral, at }
