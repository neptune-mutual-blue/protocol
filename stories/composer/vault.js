const { storeUtil } = require('../../util')

const getVault = async (contracts, coverKey) => {
  const vaultAddress = await storeUtil.getVaultAddress(contracts.store, coverKey)

  const Vault = await ethers.getContractFactory('Vault', {
    libraries: {
      StoreKeyUtil: contracts.storeKeyUtil.address,
      ProtoUtilV1: contracts.protoUtilV1.address,
      CoverUtilV1: contracts.coverUtil.address,
      NTransferUtilV2: contracts.transferLib.address
    }
  })

  const vault = await Vault.attach(vaultAddress)
  return vault
}

module.exports = { getVault }
