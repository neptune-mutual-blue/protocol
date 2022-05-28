const { ethers } = require('hardhat')
const config = require('../../scripts/config/network')

const main = async () => {
  const [deployer] = await ethers.getSigners()

  console.log('Deployer: %s. Balance: %s', deployer.address, await deployer.getBalance())

  const ContractFactory = await ethers.getContractFactory('NPMPriceOracle')

  const oracle = await ContractFactory.deploy(config[80001].stablecoinPairs.NPM_DAI)
  await oracle.deployed()

  console.log('Deployed: https://mumbai.polygonscan.com/address/%s', oracle.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
