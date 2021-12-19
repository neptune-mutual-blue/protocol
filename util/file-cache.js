const hre = require('hardhat')
const path = require('path')
const io = require('./io')

const from = async (id) => {
  const network = hre.network.name

  // if (network === 'hardhat') {
  //   return null
  // }

  const file = path.join(process.cwd(), '.deployments', `${network}.json`)
  await io.ensureFile(file, '{}')

  return {
    file,
    id
  }
}

module.exports = { from }
