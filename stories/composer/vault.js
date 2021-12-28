const { storeUtil } = require('../../util')

/**
 * Gets the vault from store
 * @param {Contracts} contracts All contracts
 * @param {string} coverKey The cover Key
 * @returns {any} Returns the vault contract
 */
const getVault = async (contracts, coverKey) => {
  const vaultAddress = await storeUtil.getVaultAddress(contracts.store, coverKey)

  const Vault = await ethers.getContractFactory('Vault', {
    libraries: {
      BaseLibV1: contracts.libs.baseLibV1.address,
      NTransferUtilV2: contracts.libs.transferLib.address,
      ValidationLibV1: contracts.libs.validationLib.address,
      VaultLibV1: contracts.libs.vaultLib.address,
      AccessControlLibV1: contracts.libs.accessControlLibV1.address,
      StoreKeyUtil: contracts.libs.storeKeyUtil.address
    }
  })

  const vault = await Vault.attach(vaultAddress)
  return vault
}

module.exports = { getVault }
