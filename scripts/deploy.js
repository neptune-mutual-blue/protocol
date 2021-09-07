const composer = require('../stories/composer')
const DEPLOYMENT_ID = 2

const deploy = async () => {
  global.log = true

  await composer.initializer.initialize(false, DEPLOYMENT_ID)
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
