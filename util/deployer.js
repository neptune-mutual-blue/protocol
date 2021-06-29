const prepare = async (contractName, libraries, ...args) => {
  const contract = libraries ? await ethers.getContractFactory(contractName, libraries) : await ethers.getContractFactory(contractName)
  return await contract.deploy(...args)
}

const deploy = async (contractName, ...args) => {
  const contract = await prepare(contractName, null, ...args)
  return contract.deployed()
}

const deployWithLibraries = async (contractName, libraries, ...args) => {
  const contract = await prepare(contractName, { libraries }, ...args)
  return contract.deployed()
}

module.exports = { prepare, deploy, deployWithLibraries }
