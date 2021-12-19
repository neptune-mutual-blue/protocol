const { deployer } = require('../../util')

const deploy = async (cache) => {
  const store = await deployer.deploy(cache, 'Store')
  return store
}

module.exports = { deploy }
