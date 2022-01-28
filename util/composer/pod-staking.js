const hre = require('hardhat')
const { percentage, zerox } = require('../helper')
const { getVault } = require('./vault')
const { covers } = require('../../examples/covers')
const { addPools } = require('./add-pools')

const createPodStakingPools = async ({ intermediate, cache, contracts, provider }) => {
  const pools = []

  for (const i in covers) {
    const cover = covers[i]

    const { stakingPool, key } = cover

    if (!stakingPool) {
      continue
    }

    const pod = await getVault(contracts, key)

    if (pod.address === zerox) {
      console.log('There is no vault available for', cover.coverName)
      continue
    }

    const {
      rewardToken,
      uniRewardTokenDollarPair,
      stakingTarget,
      maxStake,
      rewardPerBlock,
      lockupPeriod,
      rewardTokenDeposit
    } = stakingPool.settings[hre.network.config.chainId] || {}

    if (!rewardToken) {
      continue
    }

    pools.push({
      key,
      name: stakingPool.name,
      poolType: '1',
      stakingToken: pod.address,
      uniStakingTokenDollarPair: zerox,
      rewardToken,
      uniRewardTokenDollarPair,
      stakingTarget,
      maxStake,
      platformFee: percentage(0.25),
      rewardPerBlock,
      lockupPeriod: lockupPeriod.toString(),
      rewardTokenDeposit
    })
  }

  await addPools(intermediate, cache, pools, contracts, provider)
}

module.exports = { createPodStakingPools }
