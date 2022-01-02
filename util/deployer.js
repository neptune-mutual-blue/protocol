const { network } = require('hardhat')
const io = require('./io')

const getDeploymentInfo = (contractName, deployed, libraries, ...args) => {
  const payload = {
    data: libraries
  }

  payload.contractName = contractName

  if (args.length) {
    payload.constructorArguments = [...args]
  }

  payload.address = deployed.address

  return payload
}

const prepare = async (cache, contractName, libraries, ...args) => {
  const contract = libraries ? await ethers.getContractFactory(contractName, libraries) : await ethers.getContractFactory(contractName)

  const key = [contractName, ...args].join('.')

  const address = await io.fetchValue(cache, key)

  if (address) {
    global.log && console.info('[skip] No need to deploy %s: %s', contractName, address)
    return await contract.attach(address)
  }

  const instance = await contract.deploy(...args)
  const deployed = await instance.deployed()

  await io.cacheValue(cache, key, deployed.address, getDeploymentInfo(contractName, deployed, libraries, ...args))

  global.log && console.info('[tx] %s: %s %s', contractName, deployed.address, args.length ? '--> ' + JSON.stringify(args) : '')

  return deployed
}

const deploy = async (cache, contractName, ...args) => {
  const deployed = await prepare(cache, contractName, null, ...args)

  const { name } = network
  const timeout = process.env[`${name}-timeout`]

  if (timeout) {
    global.log && console.info('Wait %s ms', timeout)
    await new Promise(resolve => setTimeout(resolve, timeout))
  }

  return deployed
}

const deployWithLibraries = async (cache, contractName, libraries, ...args) => {
  const deployed = await prepare(cache, contractName, { libraries }, ...args)

  const { name } = network
  const timeout = process.env[`${name}-timeout`]

  if (timeout) {
    global.log && console.info('Wait %s ms', timeout)
    await new Promise(resolve => setTimeout(resolve, timeout))
  }

  return deployed
}

module.exports = { prepare, deploy, deployWithLibraries }
