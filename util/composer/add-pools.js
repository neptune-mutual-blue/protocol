const { approve } = require('../contract-helper/erc20')

const addPodStaking = async (intermediate, cache, info, contracts, provider) => {
  const { rewardToken } = info

  const { stakingPoolContract } = contracts
  await approve(rewardToken, stakingPoolContract.address, provider)

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', info)
}

const addPools = async (intermediate, cache, pools, contracts, provider) => {
  console.log('Wait')

  for (const i in pools) {
    const pool = pools[i]
    console.log('Task %s:%s | %s', parseInt(i) + 1, pools.length, pool.name)

    await addPodStaking(intermediate, cache, pool, contracts, provider)
  }
}

module.exports = { addPools }
