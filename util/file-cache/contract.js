const { getData } = require('./data')

const getContract = async (file, id, contractName) => {
  const data = await getData(file)
  const { deployments } = data[id]

  for (const prop in deployments) {
    const contract = deployments[prop]

    const found = contract.contractName === contractName

    if (found) {
      return contract.address
    }
  }

  return null
}

module.exports = { getContract }
