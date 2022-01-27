const hre = require('hardhat')
const { getNetworkInfo } = require('../network')

const grantRoles = async (intermediate, cache, protocol) => {
  const grantRole = async (account, role) => {
    await intermediate(cache, protocol, 'grantRole', role, account)
    console.info(account, 'was granted the', ethers.utils.toUtf8String(role), 'role')
  }

  const network = await getNetworkInfo()
  const accounts = network?.knownAccounts || []

  for (const i in accounts) {
    const { account, roles } = accounts[i]

    for (const j in roles) {
      const role = roles[j]

      await grantRole(account, role)

      if (hre.network.name === 'hardhat') {
        const [owner] = await hre.ethers.getSigners()
        await grantRole(owner.address, role)
      }
    }
  }
}

module.exports = { grantRoles }
