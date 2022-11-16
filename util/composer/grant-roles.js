const hre = require('hardhat')
const { getNetworkInfo } = require('../network')
const { ACCESS_CONTROL } = require('../../util/key')
const { key } = require('..')

const grantRoles = async (intermediate, cache, { protocol, cover, policy }) => {
  const [owner] = await hre.ethers.getSigners()
  const network = await getNetworkInfo()

  const payload = [{
    account: owner.address,
    roles: [
      ACCESS_CONTROL.COVER_MANAGER,
      ACCESS_CONTROL.UPGRADE_AGENT,
      ACCESS_CONTROL.GOVERNANCE_ADMIN
    ]
  }]

  if (network.mainnet === false) {
    payload[payload.length - 1].roles.push(ACCESS_CONTROL.LIQUIDITY_MANAGER)
  }

  if (network?.knownAccounts) {
    payload.push(...network.knownAccounts)
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
