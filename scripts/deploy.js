const composer = require('../stories/composer')

const deploy = async () => {
  global.logDeployments = true
  await composer.initializer.initialize()
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
