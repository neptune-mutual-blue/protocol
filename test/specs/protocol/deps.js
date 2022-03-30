/* eslint-disable no-unused-expressions */
const { helper, deployer } = require('../../../util')
const cache = null

const deployDependencies = async () => {
  const store = await deployer.deploy(cache, 'Store')
  const router = await deployer.deploy(cache, 'FakeUniswapV2RouterLike')

  const npm = await deployer.deploy(cache, 'FakeToken', 'Neptune Mutual Token', 'NPM', helper.ether(10000))

  const storeKeyUtil = await deployer.deploy(cache, 'StoreKeyUtil')

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

  const strategyLibV1 = await deployer.deployWithLibraries(cache, 'StrategyLibV1', {
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const coverUtilV1 = await deployer.deployWithLibraries(cache, 'CoverUtilV1', {
    RegistryLibV1: registryLibV1.address,
    StrategyLibV1: strategyLibV1.address,
    ProtoUtilV1: protoUtilV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const routineInvokerLibV1 = await deployer.deployWithLibraries(cache, 'RoutineInvokerLibV1', {
    CoverUtilV1: coverUtilV1.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StrategyLibV1: strategyLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const governanceUtilV1 = await deployer.deployWithLibraries(cache, 'GovernanceUtilV1', {
    CoverUtilV1: coverUtilV1.address,
    RoutineInvokerLibV1: routineInvokerLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const validationLibV1 = await deployer.deployWithLibraries(cache, 'ValidationLibV1', {
    AccessControlLibV1: accessControlLibV1.address,
    CoverUtilV1: coverUtilV1.address,
    GovernanceUtilV1: governanceUtilV1.address,
    ProtoUtilV1: protoUtilV1.address,
    RegistryLibV1: registryLibV1.address,
    StoreKeyUtil: storeKeyUtil.address
  })

  const baseLibV1 = await deployer.deployWithLibraries(cache, 'BaseLibV1', {
  })

  return { npm, store, router, storeKeyUtil, protoUtilV1, accessControlLibV1, registryLibV1, coverUtilV1, governanceUtilV1, validationLibV1, baseLibV1 }
}

module.exports = { deployDependencies }
