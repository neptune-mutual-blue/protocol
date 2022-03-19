const moment = require('moment')
const { deployer, fileCache, key } = require('../../util')

const DEPLOYMENT_ID = 6
const reason = 'Fix Resolution (getUnstakeInfo) Bug'
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
    StoreKeyUtil: current.storeKeyUtil
  }

  const GovernanceUtilV1 = await deployer.deployWithLibraries(null, 'GovernanceUtilV1', libraries)

  const newGovernanceUtilV1 = GovernanceUtilV1.address

  upgrade.deployments.push({
    hash: GovernanceUtilV1.hash,
    contract: 'GovernanceUtilV1',
    libraries,
    address: newGovernanceUtilV1
  })

  console.info('GovernanceUtilV1 deployed at %s', newGovernanceUtilV1)

  libraries = {
    AccessControlLibV1: current.accessControlLibV1,
    BaseLibV1: current.baseLibV1,
    RoutineInvokerLibV1: current.routineInvokerLibV1,
    StoreKeyUtil: current.storeKeyUtil,
    ProtoUtilV1: current.protoUtilV1,
    CoverUtilV1: current.coverUtilV1,
    NTransferUtilV2: current.nTransferUtilV2,
    ValidationLibV1: current.validationLibV1,
    GovernanceUtilV1: newGovernanceUtilV1
  }

  const Resolution = await deployer.deployWithLibraries(null, 'Resolution',
    libraries,
    current.store
  )

  const newResolution = Resolution.address

  upgrade.deployments.push({
    hash: GovernanceUtilV1.hash,
    contract: 'Resolution',
    libraries,
    address: newResolution
  })

  console.info('Resolution deployed at %s', newResolution)

  const args = [key.PROTOCOL.CNS.GOVERNANCE_RESOLUTION, current.resolution, newResolution]

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
