const moment = require('moment')
const { deployer, fileCache, key } = require('../../util')

const DEPLOYMENT_ID = 6
const reason = 'Fix VaultDelegate (preRemoveLiquidity) Bug'
const timestamp = moment(new Date()).unix()

const upgradeContract = async () => {
  const cache = await fileCache.from(DEPLOYMENT_ID)
  const current = await cache.getContracts()

  const upgrade = {
    reason,
    timestamp,
    deployments: [],
    transactions: []
  }

  let libraries = {
    CoverUtilV1: current.coverUtilV1,
    RoutineInvokerLibV1: current.routineInvokerLibV1,
    ProtoUtilV1: current.protoUtilV1,
    RegistryLibV1: current.registryLibV1,
    StoreKeyUtil: current.storeKeyUtil,
    StrategyLibV1: current.strategyLibV1
  }

  const VaultLibV1 = await deployer.deployWithLibraries(null, 'VaultLibV1', libraries)

  const newVaultLibV1 = VaultLibV1.address

  upgrade.deployments.push({
    hash: VaultLibV1.hash,
    contract: 'VaultLibV1',
    libraries,
    address: newVaultLibV1
  })

  console.info('VaultLibV1 deployed at %s', newVaultLibV1)

  libraries = {
    AccessControlLibV1: current.accessControlLibV1,
    BaseLibV1: current.baseLibV1,
    ProtoUtilV1: current.protoUtilV1,
    RoutineInvokerLibV1: current.routineInvokerLibV1,
    StoreKeyUtil: current.storeKeyUtil,
    StrategyLibV1: current.strategyLibV1,
    ValidationLibV1: current.validationLibV1,
    VaultLibV1: newVaultLibV1
  }

  const VaultDelegate = await deployer.deployWithLibraries(null, 'VaultDelegate',
    libraries,
    current.store
  )

  const newVaultDelegate = VaultDelegate.address

  upgrade.deployments.push({
    hash: VaultLibV1.hash,
    contract: 'VaultDelegate',
    libraries,
    address: newVaultDelegate
  })

  console.info('VaultDelegate deployed at %s', newVaultDelegate)

  const args = [key.PROTOCOL.CNS.COVER_VAULT_DELEGATE, '0x8865Be1dD4e1660D5Ba20034B5fF322101ee682b', newVaultDelegate]

  const result = await current.protocolInstance.upgradeContract(...args)

  upgrade.transactions.push({
    hash: result.hash,
    contract: 'Protocol',
    args,
    address: current.protocol
  })

  await cache.addUpgrade(upgrade)
}

upgradeContract()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
