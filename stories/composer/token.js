const { deployer, helper } = require('../../util')

const deploySeveral = async (tokens) => {
  const contracts = []

  for (let i = 0; i < tokens.length; i++) {
    const { name, symbol, supply } = tokens[i]

    const contract = await deployer.deploy('FakeToken', name, symbol, supply || helper.ether(100_000_000_000_000_000_000_000))

    const [_, alice, bob, chris, david, emily, franklin, george, harry, isabel, john, kimberly, lewis] = await ethers.getSigners() // eslint-disable-line

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

    contracts.push(contract)
  }

  return contracts
}

const at = async (address) => {
  const token = await ethers.getContractFactory('FakeToken')
  return await token.attach(address)
}

module.exports = { deploySeveral, at }
