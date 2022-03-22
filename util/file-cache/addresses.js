const { getContract } = require('./contract')
const attacher = require('../../test/util/attach/attach')

const getProtocol = async (at, current) => {
  return attacher.attach('Protocol', at, {
    libraries: {
      AccessControlLibV1: current.accessControlLibV1,
      BaseLibV1: current.baseLibV1,
      ProtoUtilV1: current.protoUtilV1,
      RegistryLibV1: current.registryLibV1,
      StoreKeyUtil: current.storeKeyUtil,
      ValidationLibV1: current.validationLibV1
    }
  })
}

const getContracts = async (file, id) => {
  const accessControlLibV1 = await getContract(file, id, 'AccessControlLibV1')

  const baseLibV1 = await getContract(file, id, 'BaseLibV1')
  const bokkyPooBahsDateTimeLibrary = await getContract(file, id, 'BokkyPooBahsDateTimeLibrary')
  const bondPoolLibV1 = await getContract(file, id, 'BondPoolLibV1')
  const bondPool = await getContract(file, id, 'BondPool')

  const compoundStrategy = await getContract(file, id, 'CompoundStrategy')
  const cover = await getContract(file, id, 'Cover')
  const coverLibV1 = await getContract(file, id, 'CoverLibV1')
  const coverProvision = await getContract(file, id, 'CoverProvision')
  const coverReassurance = await getContract(file, id, 'CoverReassurance')
  const coverStake = await getContract(file, id, 'CoverStake')
  const coverUtilV1 = await getContract(file, id, 'CoverUtilV1')
  const cxTokenFactory = await getContract(file, id, 'cxTokenFactory')
  const cxTokenFactoryLibV1 = await getContract(file, id, 'cxTokenFactoryLibV1')

  const governance = await getContract(file, id, 'Governance')
  const governanceUtilV1 = await getContract(file, id, 'GovernanceUtilV1')

  const liquidityEngine = await getContract(file, id, 'LiquidityEngine')

  const nTransferUtilV2 = await getContract(file, id, 'NTransferUtilV2')

  const policy = await getContract(file, id, 'Policy')
  const policyAdmin = await getContract(file, id, 'PolicyAdmin')
  const policyHelperV1 = await getContract(file, id, 'PolicyHelperV1')
  const priceDiscovery = await getContract(file, id, 'PriceDiscovery')
  const priceLibV1 = await getContract(file, id, 'PriceLibV1')
  const processor = await getContract(file, id, 'Processor')
  const protocol = await getContract(file, id, 'Protocol')
  const protoUtilV1 = await getContract(file, id, 'ProtoUtilV1')

  const registryLibV1 = await getContract(file, id, 'RegistryLibV1')
  const resolution = await getContract(file, id, 'Resolution')
  const routineInvokerLibV1 = await getContract(file, id, 'RoutineInvokerLibV1')

  const stakingPoolCoreLibV1 = await getContract(file, id, 'StakingPoolCoreLibV1')
  const stakingPoolLibV1 = await getContract(file, id, 'StakingPoolLibV1')
  const stakingPools = await getContract(file, id, 'StakingPools')
  const strategyLibV1 = await getContract(file, id, 'StrategyLibV1')
  const store = await getContract(file, id, 'Store')
  const storeKeyUtil = await getContract(file, id, 'StoreKeyUtil')

  const validationLibV1 = await getContract(file, id, 'ValidationLibV1')
  const vaultFactory = await getContract(file, id, 'VaultFactory')
  const vaultFactoryLibV1 = await getContract(file, id, 'VaultFactoryLibV1')
  const vaultLibV1 = await getContract(file, id, 'VaultLibV1')

  const current = {
    accessControlLibV1,
    baseLibV1,
    bokkyPooBahsDateTimeLibrary,
    bondPool,
    bondPoolLibV1,
    compoundStrategy,
    cover,
    coverLibV1,
    coverProvision,
    coverReassurance,
    coverStake,
    coverUtilV1,
    cxTokenFactory,
    cxTokenFactoryLibV1,
    governance,
    governanceUtilV1,
    liquidityEngine,
    nTransferUtilV2,
    policy,
    policyAdmin,
    policyHelperV1,
    priceDiscovery,
    priceLibV1,
    processor,
    protocol,
    protoUtilV1,
    registryLibV1,
    resolution,
    routineInvokerLibV1,
    stakingPoolCoreLibV1,
    stakingPoolLibV1,
    stakingPools,
    strategyLibV1,
    store,
    storeKeyUtil,
    validationLibV1,
    vaultFactory,
    vaultFactoryLibV1,
    vaultLibV1
  }

  current.protocolInstance = await getProtocol(protocol, current)

  return current
}

module.exports = { getContracts }
