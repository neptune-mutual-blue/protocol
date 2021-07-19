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
      StoreKeyUtil: contracts.libs.storeKeyUtil.address,
      ProtoUtilV1: contracts.libs.protoUtilV1.address,
      NTransferUtilV2: contracts.libs.transferLib.address,
      RegistryLibV1: contracts.libs.registryLib.address,
      ValidationLibV1: contracts.libs.validationLib.address
    }
  })

  const vault = await Vault.attach(vaultAddress)
  return vault
}

module.exports = { getVault }
