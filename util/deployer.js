const prepare = async (contractName, libraries, ...args) => {
  const contract = libraries ? await ethers.getContractFactory(contractName, libraries) : await ethers.getContractFactory(contractName)
  return await contract.deploy(...args)
}

const deploy = async (contractName, ...args) => {
  const contract = await prepare(contractName, null, ...args)
  const deployed = await contract.deployed()

  if (global.logDeployments) {
    console.info('%s: %s %s', contractName, deployed.address, args.length ? '--> ' + JSON.stringify(args) : '')
  }

  return deployed
}

const deployWithLibraries = async (contractName, libraries, ...args) => {
  const contract = await prepare(contractName, { libraries }, ...args)
  const deployed = await contract.deployed()

  if (global.logDeployments) {
    console.info('%s: %s %s', contractName, deployed.address, args.length ? '-->' + JSON.stringify(args) : '')
  }

  return deployed
}

module.exports = { prepare, deploy, deployWithLibraries }
