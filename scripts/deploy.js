const { network } = require('hardhat')
const composer = require('../util/composer')
const DEPLOYMENT_ID = 5

const deploy = async () => {
  const skipCache = network.name === 'hardhat'

  global.log = true
  await composer.initializer.initialize(skipCache, DEPLOYMENT_ID)
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
