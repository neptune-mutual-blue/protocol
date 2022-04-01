const moment = require('moment')
const { deployer, fileCache, key } = require('../../util')

const DEPLOYMENT_ID = 6
const reason = 'Fix Bond Pool (Maximum Amount) Bug'
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
    NTransferUtilV2: current.nTransferUtilV2,
    PriceLibV1: current.priceLibV1,
    ProtoUtilV1: current.protoUtilV1,
    StoreKeyUtil: current.storeKeyUtil,
    ValidationLibV1: current.validationLibV1
  }

  console.info(libraries)

  const BondPoolLibV1 = await deployer.deployWithLibraries(null, 'BondPoolLibV1', libraries)

  const newBondPoolLibV1 = BondPoolLibV1.address

  upgrade.deployments.push({
    hash: BondPoolLibV1.hash,
    contract: 'BondPoolLibV1',
    libraries,
    address: newBondPoolLibV1
  })

  console.info('BondPoolLibV1 deployed at %s', newBondPoolLibV1)

  libraries = {
    AccessControlLibV1: current.accessControlLibV1,
    BondPoolLibV1: newBondPoolLibV1,
    BaseLibV1: current.baseLibV1,
    PriceLibV1: current.priceLibV1,
    ValidationLibV1: current.validationLibV1
  }

  const BondPool = await deployer.deployWithLibraries(null, 'BondPool', libraries, current.store)
  const newBondPool = BondPool.address

  upgrade.deployments.push({
    hash: BondPool.hash,
    contract: 'BondPool',
    libraries,
    address: newBondPool
  })

  console.info('Bond Pool deployed at %s', newBondPool)

  const args = [key.PROTOCOL.CNS.BOND_POOL, current.bondPool, newBondPool]

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
