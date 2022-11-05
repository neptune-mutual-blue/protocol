const { formatEther } = require('ethers/lib/utils')
const { network } = require('hardhat')
const { ethers } = require('hardhat')

const deploy = async (contractName, ...args) => {
  const ContractFactory = await ethers.getContractFactory(contractName)
  const instance = await ContractFactory.deploy(...args)
  await instance.deployed()

  const { explorer } = network.config

  if (explorer) {
    console.log('%s Deployed: %s/address/%s', contractName, network.config.explorer, instance.address)
  } else {
    console.log('%s Deployed: %s', contractName, instance.address)
  }

  return instance
}

const main = async () => {
  const [deployer] = await ethers.getSigners()

  const previousBalance = await deployer.getBalance()

  console.log('Deployer: %s. Balance: %s ETH', deployer.address, formatEther(previousBalance))

  await deploy('POT', deployer.address)

  const balance = await deployer.getBalance()
  const cost = previousBalance.sub(balance)
  console.log('Cost: %s ETH. Balance: %s ETH', formatEther(cost), formatEther(balance))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
