const { deployer } = require('..')

const deploy = async (cache) => {
  return deployer.deploy(cache, 'Store')
}

module.exports = { deploy }
