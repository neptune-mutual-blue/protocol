const { ethers } = require('hardhat')

const PriceOracle = '0xD6b5038261369fE982e6aCaD3586A97BbFfF2DbC'
const DAI = '0x76061C192fBBBF210d2dA25D4B8aaA34b798ccaB'
const NPM = '0x001Ffb65fF6E15902072C5133C016fD89cB56a7e'

async function main () {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  console.log('Account balance:', (await deployer.getBalance()).toString())

  const ContractFactory = await ethers.getContractFactory('NPMPriceOracle')
  const instance = ContractFactory.attach(PriceOracle)

  // Update price
  // const tx = await instance.update()
  // await tx.wait()

  // DAI per NPM
  const DAIperNPM = await instance.consult(NPM, ethers.BigNumber.from(10).pow(18))
  // NPM per DAI
  const NPMperDAI = await instance.consult(DAI, ethers.BigNumber.from(10).pow(18))

  console.log({
    DAIperNPM: DAIperNPM.toString(),
    NPMperDAI: NPMperDAI.toString()
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
