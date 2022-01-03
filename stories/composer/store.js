const { deployer } = require('../../util')

const deploy = async (cache) => {
  return deployer.deploy(cache, 'Store')
}

module.exports = { deploy }
