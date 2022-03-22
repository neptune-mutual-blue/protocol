const hre = require('hardhat')
const path = require('path')
const io = require('../io')
const { getData } = require('./data')
const { getContract } = require('./contract')
const { getContracts } = require('./addresses')
const { addUpgrade } = require('./upgrade')

const from = async (id) => {
  const network = hre.network.name

  const file = path.join(process.cwd(), '.deployments', `${network}.json`)

  await io.ensureFile(file, '{}')

  return {
    file,
    getData: () => getData(file),
    addUpgrade: (upgrade) => addUpgrade(file, id, upgrade),
    getContract: (contractName) => getContract(file, id, contractName),
    getContracts: () => getContracts(file, id),
    id
  }
}

module.exports = { from }
