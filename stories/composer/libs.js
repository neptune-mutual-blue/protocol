const { deployer } = require('../../util')

/**
 * Deploys all libraries
 * @return {Libraries}
 */
const deployAll = async () => {
  const dateLib = await deployer.deploy('BokkyPooBahsDateTimeLibrary')
  const storeKeyUtil = await deployer.deploy('StoreKeyUtil')
  const transferLib = await deployer.deploy('NTransferUtilV2')

  const protoUtilV1 = await deployer.deployWithLibraries('ProtoUtilV1', {
    StoreKeyUtil: storeKeyUtil.address
  })

  const registryLib = await deployer.deployWithLibraries('RegistryLibV1', {
    StoreKeyUtil: storeKeyUtil.address,
    ProtoUtilV1: protoUtilV1.address
  })

  const coverUtil = await deployer.deployWithLibraries('CoverUtilV1', {
    StoreKeyUtil: storeKeyUtil.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLib.address
  })

  const governanceLib = await deployer.deployWithLibraries('GovernanceUtilV1', {
    StoreKeyUtil: storeKeyUtil.address,
    CoverUtilV1: coverUtil.address
  })

  const validationLib = await deployer.deployWithLibraries('ValidationLibV1', {
    StoreKeyUtil: storeKeyUtil.address,
    ProtoUtilV1: protoUtilV1.address,
    CoverUtilV1: coverUtil.address,
    GovernanceUtilV1: governanceLib.address
  })

  const vaultFactoryLib = await deployer.deployWithLibraries('VaultFactoryLibV1', {
    StoreKeyUtil: storeKeyUtil.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLib.address,
    NTransferUtilV2: transferLib.address,
    ValidationLibV1: validationLib.address
  })

  const cTokenFactoryLib = await deployer.deployWithLibraries('cTokenFactoryLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    ValidationLibV1: validationLib.address
  })

  return {
    storeKeyUtil,
    protoUtilV1,
    coverUtil,
    transferLib,
    registryLib,
    validationLib,
    governanceLib,
    vaultFactoryLib,
    cTokenFactoryLib,
    dateLib
  }
}

module.exports = { deployAll }
