const { deployer } = require('..')

/**
 * Deploys all libraries
 * @return {Promise<Libraries>}
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

  const registryLibV1 = await deployer.deployWithLibraries(cache, 'RegistryLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const coverUtilV1 = await deployer.deployWithLibraries(cache, 'CoverUtilV1', {
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const strategyLibV1 = await deployer.deployWithLibraries(cache, 'StrategyLibV1', {
    StoreKeyUtil: storeKeyUtil.address
  })

  const routineInvokerLibV1 = await deployer.deployWithLibraries(cache, 'RoutineInvokerLibV1', {
    CoverUtilV1: coverUtilV1.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StrategyLibV1: strategyLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const policyHelperV1 = await deployer.deployWithLibraries(cache, 'PolicyHelperV1', {
    CoverUtilV1: coverUtilV1.address,
    NTransferUtilV2: transferLib.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const governanceLib = await deployer.deployWithLibraries(cache, 'GovernanceUtilV1', {
    CoverUtilV1: coverUtilV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const validationLib = await deployer.deployWithLibraries(cache, 'ValidationLibV1', {
    CoverUtilV1: coverUtilV1.address,
    GovernanceUtilV1: governanceLib.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const coverLibV1 = await deployer.deployWithLibraries(cache, 'CoverLibV1', {
    AccessControlLibV1: accessControlLibV1.address,
    CoverUtilV1: coverUtilV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    NTransferUtilV2: transferLib.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    ValidationLibV1: validationLib.address
  })

  const priceLibV1 = await deployer.deployWithLibraries(cache, 'PriceLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const vaultLib = await deployer.deployWithLibraries(cache, 'VaultLibV1', {
    CoverUtilV1: coverUtilV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    NTransferUtilV2: transferLib.address,
    ProtoUtilV1: protoUtilV1.address,
    PolicyHelperV1: policyHelperV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    ValidationLibV1: validationLib.address
  })

  const baseLibV1 = await deployer.deployWithLibraries(cache, 'BaseLibV1')

  const vaultFactoryLib = await deployer.deployWithLibraries(cache, 'VaultFactoryLibV1', {
    AccessControlLibV1: accessControlLibV1.address,
    BaseLibV1: baseLibV1.address,
    NTransferUtilV2: transferLib.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    ValidationLibV1: validationLib.address,
    VaultLibV1: vaultLib.address
  })

  const cxTokenFactoryLib = await deployer.deployWithLibraries(cache, 'cxTokenFactoryLibV1', {
    AccessControlLibV1: accessControlLibV1.address,
    BaseLibV1: baseLibV1.address,
    ValidationLibV1: validationLib.address
  })

  const stakingPoolCoreLibV1 = await deployer.deployWithLibraries(cache, 'StakingPoolCoreLibV1', {
    NTransferUtilV2: transferLib.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const stakingPoolLibV1 = await deployer.deployWithLibraries(cache, 'StakingPoolLibV1', {
    NTransferUtilV2: transferLib.address,
    ProtoUtilV1: protoUtilV1.address,
    StakingPoolCoreLibV1: stakingPoolCoreLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const bondPoolLibV1 = await deployer.deployWithLibraries(cache, 'BondPoolLibV1', {
    NTransferUtilV2: transferLib.address,
    PriceLibV1: priceLibV1.address,
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address,
    ValidationLibV1: validationLib.address
  })

  return {
    baseLibV1,
    accessControlLibV1,
    storeKeyUtil,
    protoUtilV1,
    coverLibV1,
    coverUtilV1,
    transferLib,
    registryLibV1,
    validationLib,
    governanceLib,
    vaultFactoryLib,
    vaultLib,
    cxTokenFactoryLib,
    dateLib,
    bondPoolLibV1,
    stakingPoolCoreLibV1,
    stakingPoolLibV1,
    priceLibV1,
    RoutineInvokerLibV1: routineInvokerLibV1,
    strategyLibV1,
    policyHelperV1
  }
}

module.exports = { deployAll }
