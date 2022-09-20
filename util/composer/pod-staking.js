const hre = require('hardhat')
const { percentage, zerox } = require('../helper')
const { getVault } = require('./vault')
const { covers } = require('../../examples/dedicated')
const { addPools } = require('./add-pools')

const getTokenAddress = (tokenInfo, addressOrObject) => {
  if (typeof (addressOrObject) === 'string') {
    return addressOrObject
  }

  if (Object.prototype.hasOwnProperty.call(addressOrObject, 'symbol')) {
    const { symbol } = addressOrObject

    if (symbol) {
      return tokenInfo.find(x => x.symbol === symbol).instance.address
    }
  }
}

const getPairAddress = (pairInfo, pairAddressOrObject) => {
  if (typeof (pairAddressOrObject) === 'string') {
    return pairAddressOrObject
  }

  if (Object.prototype.hasOwnProperty.call(pairAddressOrObject, 'token')) {
    const { token } = pairAddressOrObject

    if (token) {
      return pairInfo.find(x => x.name.split('/')[0] === token).pairInstance.address
    }
  }
}

const getAssets = (tokenInfo, pairInfo, settings) => {
  const { rewardToken, uniRewardTokenDollarPair } = settings

  return {
    rewardToken: getTokenAddress(tokenInfo, rewardToken),
    uniRewardTokenDollarPair: getPairAddress(pairInfo, uniRewardTokenDollarPair)
  }
}

const createPodStakingPools = async (payload) => {
  const { intermediate, cache, contracts, provider, tokenInfo, pairInfo } = payload
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

    const settings = stakingPool.settings[hre.network.config.chainId] || {}

    const {
      stakingTarget,
      maxStake,
      rewardPerBlock,
      lockupPeriod,
      rewardTokenToDeposit
    } = settings

    const { rewardToken, uniRewardTokenDollarPair } = getAssets(tokenInfo, pairInfo, settings)

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
      lockupPeriod,
      rewardTokenToDeposit
    })
  }

  await addPools(intermediate, cache, pools, contracts, provider)
}

module.exports = { createPodStakingPools }
