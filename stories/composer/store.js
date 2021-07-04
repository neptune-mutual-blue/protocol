const { deployer } = require('../../util')

const deploy = async () => {
  const store = await deployer.deploy('Store')
  return store
}

module.exports = { deploy }
