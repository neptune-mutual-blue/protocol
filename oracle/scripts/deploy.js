const { ethers } = require('hardhat')

const factory = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
const DAI = '0x76061C192fBBBF210d2dA25D4B8aaA34b798ccaB'
const NPM = '0x001Ffb65fF6E15902072C5133C016fD89cB56a7e'

async function main () {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  console.log('Account balance:', (await deployer.getBalance()).toString())

  const ContractFactory = await ethers.getContractFactory('NPMPriceOracle')
  const priceOracle = await ContractFactory.deploy(factory, NPM, DAI)

  await priceOracle.deployed()

  console.log('Contract deployment address:', priceOracle.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
