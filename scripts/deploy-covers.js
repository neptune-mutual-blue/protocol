const { deploy } = require('./covers/deployments/binance')

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
