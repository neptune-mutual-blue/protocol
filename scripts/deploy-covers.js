const { deploy } = require('./covers/deployments/popular-defi-apps')

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
