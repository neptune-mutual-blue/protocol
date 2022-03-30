const hre = require('hardhat')
const { getNetworkInfo } = require('../network')

const grantRoles = async (intermediate, cache, protocol) => {
  const network = await getNetworkInfo()
  const payload = network?.knownAccounts || []

  if (hre.network.name === 'hardhat') {
    const [owner] = await hre.ethers.getSigners()
    payload.push({ account: owner.address, roles: payload[0].roles })
  }

  await intermediate(cache, protocol, 'grantRoles', payload)
}

module.exports = { grantRoles }
