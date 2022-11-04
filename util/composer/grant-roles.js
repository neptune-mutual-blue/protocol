const hre = require('hardhat')
const { getNetworkInfo } = require('../network')
const { ACCESS_CONTROL } = require('../../util/key')
const { key } = require('..')

const grantRoles = async (intermediate, cache, { protocol, cover, policy }) => {
  const network = await getNetworkInfo()
  const payload = network?.knownAccounts || []

  const [owner] = await hre.ethers.getSigners()

  payload.push({
    account: owner.address,
    roles: [
      ACCESS_CONTROL.COVER_MANAGER,
      ACCESS_CONTROL.UPGRADE_AGENT
    ]
  })

  if (!network.mainnet) {
    payload[payload.length - 1].roles.push(ACCESS_CONTROL.LIQUIDITY_MANAGER)
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
