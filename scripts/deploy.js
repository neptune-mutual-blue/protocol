const { network, ethers } = require('hardhat')
const composer = require('../util/composer')
const helper = require('../util/helper')
const covers = require('../util/composer/covers')
const podStakingPools = require('../util/composer/pod-staking')
const demoData = require('../util/demo-data')

const DEPLOYMENT_ID = 6

const rest = (time) => new Promise((resolve) => setTimeout(resolve, time))

const deploy = async () => {
  global.log = true
  const [owner] = await ethers.getSigners()

  const isHardhat = network.name === 'hardhat'

  const result = await composer.initializer.initialize(isHardhat, DEPLOYMENT_ID)
  const { intermediate, cache, tokenInfo, pairInfo, startBalance } = result

  console.info('Stop: 100ms')
  await rest(100)
  console.info('Go')
  await covers.create({ intermediate, cache, contracts: result })

  console.info('Stop: 200ms')
  await rest(200)
  console.info('Go')
  await podStakingPools.create({ intermediate, cache, contracts: result, tokenInfo, pairInfo, provider: owner })

  console.info('Stop: 200ms')
  await rest(200)
  console.info('Go')
  await demoData.create(result)

  const endBalance = await ethers.provider.getBalance(owner.address)
  const spent = startBalance.sub(endBalance)
  console.log('Gas consumed %s / Balance: %s', helper.weiAsToken(spent, 'ETH'), helper.weiAsToken(endBalance, 'ETH'))
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
