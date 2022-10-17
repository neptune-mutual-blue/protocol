const hre = require('hardhat')
const { getNetworkInfo } = require('../network')
const { key } = require('..')

const grantRoles = async (intermediate, cache, { protocol, cover, policy }) => {
  const network = await getNetworkInfo()
  const payload = network?.knownAccounts || []

  if (hre.network.name === 'hardhat') {
    const [owner] = await hre.ethers.getSigners()
    payload.push({ account: owner.address, roles: payload[0].roles })
  }

  payload.push({
    account: cover.address,
    roles: [key.ACCESS_CONTROL.UPGRADE_AGENT]
  },
  {
    account: policy.address,
    roles: [key.ACCESS_CONTROL.UPGRADE_AGENT]
  },
  {
    account: protocol.address,
    roles: [key.ACCESS_CONTROL.UPGRADE_AGENT]
  })

  await intermediate(cache, protocol, 'grantRoles', payload)
}

module.exports = { grantRoles }
