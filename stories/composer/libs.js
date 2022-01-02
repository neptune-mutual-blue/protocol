const { deployer } = require('../../util')

/**
 * Deploys all libraries
 * @return {Libraries}
 */
const deployAll = async (cache) => {
  const dateLib = await deployer.deploy(cache, 'BokkyPooBahsDateTimeLibrary')

  const storeKeyUtil = await deployer.deploy(cache, 'StoreKeyUtil')

  const transferLib = await deployer.deploy(cache, 'NTransferUtilV2')

  const protoUtilV1 = await deployer.deployWithLibraries(cache, 'ProtoUtilV1', {
    StoreKeyUtil: storeKeyUtil.address
  })

  const accessControlLibV1 = await deployer.deployWithLibraries(cache, 'AccessControlLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const registryLib = await deployer.deployWithLibraries(cache, 'RegistryLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const coverUtil = await deployer.deployWithLibraries(cache, 'CoverUtilV1', {
    StoreKeyUtil: storeKeyUtil.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLib.address
  })

  const governanceLib = await deployer.deployWithLibraries(cache, 'GovernanceUtilV1', {
    StoreKeyUtil: storeKeyUtil.address,
    CoverUtilV1: coverUtil.address
  })

  const validationLib = await deployer.deployWithLibraries(cache, 'ValidationLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    CoverUtilV1: coverUtil.address,
    GovernanceUtilV1: governanceLib.address
  })

  const vaultLib = await deployer.deployWithLibraries(cache, 'VaultLibV1', {
    CoverUtilV1: coverUtil.address,
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    RegistryLibV1: registryLib.address,
    NTransferUtilV2: transferLib.address,
    ValidationLibV1: validationLib.address
  })

  const baseLibV1 = await deployer.deployWithLibraries(cache, 'BaseLibV1', {
    ValidationLibV1: validationLib.address,
    AccessControlLibV1: accessControlLibV1.address
  })

  const vaultFactoryLib = await deployer.deployWithLibraries(cache, 'VaultFactoryLibV1', {
    BaseLibV1: baseLibV1.address,
    NTransferUtilV2: transferLib.address,
    ValidationLibV1: validationLib.address,
    VaultLibV1: vaultLib.address,
    AccessControlLibV1: accessControlLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const cxTokenFactoryLib = await deployer.deployWithLibraries(cache, 'cxTokenFactoryLibV1', {
    BaseLibV1: baseLibV1.address,
    ValidationLibV1: validationLib.address
  })

  const stakingPoolLibV1 = await deployer.deployWithLibraries(cache, 'StakingPoolLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    NTransferUtilV2: transferLib.address
  })

  const bondPoolLibV1 = await deployer.deployWithLibraries(cache, 'BondPoolLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    AccessControlLibV1: accessControlLibV1.address,
    ValidationLibV1: validationLib.address,
    NTransferUtilV2: transferLib.address

  })

  return {
    baseLibV1,
    accessControlLibV1,
    storeKeyUtil,
    protoUtilV1,
    coverUtil,
    transferLib,
    registryLib,
    validationLib,
    governanceLib,
    vaultFactoryLib,
    vaultLib,
    cxTokenFactoryLib,
    dateLib,
    bondPoolLibV1,
    stakingPoolLibV1
  }
}

module.exports = { deployAll }
