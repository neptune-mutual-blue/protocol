const { network } = require('hardhat')
const composer = require('../util/composer')
const { createCovers } = require('../util/composer/covers')
const { createPodStakingPools } = require('../util/composer/pod-staking')
const DEPLOYMENT_ID = 6

const rest = (time) => new Promise((resolve) => setTimeout(resolve, time))

const deploy = async () => {
  global.log = true
  const [owner] = await ethers.getSigners()

  const skipCache = network.name === 'hardhat'

  const result = await composer.initializer.initialize(skipCache, DEPLOYMENT_ID)
  const { intermediate, cache } = result

  console.info('Stop: 100ms')
  await rest(100)
  console.info('Go')
  await createCovers({ intermediate, cache, contracts: result })

  console.info('Stop: 200ms')
  await rest(200)
  console.info('Go')
  await createPodStakingPools({ intermediate, cache, contracts: result, provider: owner })
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
