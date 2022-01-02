const hre = require('hardhat')
const path = require('path')
const { io, fileCache } = require('../util')

const DEPLOYMENT_ID = 4

const updateCache = async (name) => {
  const cache = await fileCache.from(DEPLOYMENT_ID)
  const { file, id } = cache
  const contents = await io.readFile(file)
  const parsed = JSON.parse(contents)

  parsed[id].deployments[name].verified = true

  await io.saveToDisk(file, parsed)
}

const verifyUsingContractParam = async (name, deployment) => {
  try {
    const files = await io.findFiles('sol', path.join(process.cwd(), 'contracts'))
    const contract = files.find(x => x.indexOf(name) > -1).replace(process.cwd(), '').substr(1)

    deployment.contract = `${contract}:${deployment.contractName}`

    console.log(deployment)

    await hre.run('verify:verify', deployment)
    await updateCache(name)
  } catch (error) {
    if (error.message.indexOf('Already Verified') > -1) {
      await updateCache(name)
    }

    console.info(error.message)
  }
}

const verify = async (name, deployment) => {
  try {
    await hre.run('verify:verify', deployment)
    await updateCache(name)
  } catch (error) {
    if (error.message.indexOf('Already Verified') > -1) {
      await updateCache(name)
      return
    }

    if (error.message.indexOf('More than one contract') > -1) {
      await verifyUsingContractParam(name, deployment)
      return
    }

    console.info(error.message)
  }
}

const run = async () => {
  global.log = true

  const cache = await fileCache.from(DEPLOYMENT_ID)
  const deployments = await io.fetchValue(cache, 'deployments')

  for (const name in deployments) {
    const deployment = deployments[name]

    if (deployment.verified) {
      console.log('%s already verified', deployment.contractName)
      continue
    }

    await verify(name, deployment)

    // Be nice
    await new Promise(resolve => setTimeout(resolve, 10000))
  }
}

run()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
