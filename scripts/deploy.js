const { network } = require('hardhat')
const composer = require('../util/composer')
const { createCovers } = require('../util/composer/covers')
const { createPodStakingPools } = require('../util/composer/pod-staking')
const { createDemoData } = require('../util/demo-data')

const DEPLOYMENT_ID = 6

const rest = (time) => new Promise((resolve) => setTimeout(resolve, time))

const deploy = async () => {
  global.log = true
  const [owner] = await ethers.getSigners()

  const isHardhat = network.name === 'hardhat'

  const result = await composer.initializer.initialize(isHardhat, DEPLOYMENT_ID)
  const { intermediate, cache, tokenInfo, pairInfo } = result

  console.info('Stop: 100ms')
  await rest(100)
  console.info('Go')
  await createCovers({ intermediate, cache, contracts: result })

  console.info('Stop: 200ms')
  await rest(200)
  console.info('Go')
  await createPodStakingPools({ intermediate, cache, contracts: result, tokenInfo, pairInfo, provider: owner })

  console.info('Stop: 200ms')
  await rest(200)
  console.info('Go')
  await createDemoData(result)
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
