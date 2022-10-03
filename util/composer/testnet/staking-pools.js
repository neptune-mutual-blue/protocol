const hre = require('hardhat')
const { key, helper, intermediate } = require('../..')
const { minutesToBlocks } = require('../../block-time')

const setStakingPools = async (cache, contracts) => {
  const chainId = hre.network.config.chainId

  const { bec, becUsdPair, crpool, crpoolUsdPair, hwt, hwtUsdPair, npm, npmUsdPair, obk, obkUsdPair, sabre, sabreUsdPair, stakingPoolContract, xd, xdUsdPair } = contracts

  // @todo: only applicable to testnet
  await intermediate(cache, crpool, 'approve', stakingPoolContract.address, helper.ether(22_094_995_300))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('Crpool'),
    name: 'Crystalpool Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: crpool.address,
    uniRewardTokenDollarPair: crpoolUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(10_000),
    platformFee: helper.percentage(0.5),
    rewardPerBlock: (22_094_995_300).toString(),
    lockupPeriod: minutesToBlocks(chainId, 5),
    rewardTokenToDeposit: helper.ether(13_400_300)
  })

  await intermediate(cache, hwt, 'approve', stakingPoolContract.address, helper.ether(13_522_000_000))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('Huobi'),
    name: 'Huobi Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: hwt.address,
    uniRewardTokenDollarPair: hwtUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(10_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (13_522_000_000).toString(),
    lockupPeriod: minutesToBlocks(chainId, 120),
    rewardTokenToDeposit: helper.ether(25_303_000)
  })

  await intermediate(cache, obk, 'approve', stakingPoolContract.address, helper.ether(14_505_290_000))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('OBK'),
    name: 'OBK Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: obk.address,
    uniRewardTokenDollarPair: obkUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(10_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (14_505_290_000).toString(),
    lockupPeriod: minutesToBlocks(chainId, 60),
    rewardTokenToDeposit: helper.ether(16_30_330)
  })

  await intermediate(cache, sabre, 'approve', stakingPoolContract.address, helper.ether(30_330_000_010))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('SABRE'),
    name: 'SABRE Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: sabre.address,
    uniRewardTokenDollarPair: sabreUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(100_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (30_330_000_010).toString(),
    lockupPeriod: minutesToBlocks(chainId, 180),
    rewardTokenToDeposit: helper.ether(42_000_000)
  })

  await intermediate(cache, bec, 'approve', stakingPoolContract.address, helper.ether(8_940_330_000))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('BEC'),
    name: 'BEC Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: bec.address,
    uniRewardTokenDollarPair: becUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(100_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (8_940_330_000).toString(),
    lockupPeriod: minutesToBlocks(chainId, 60 * 48),
    rewardTokenToDeposit: helper.ether(27_000_000)
  })

  await intermediate(cache, xd, 'approve', stakingPoolContract.address, helper.ether(18_559_222_222))

  await intermediate(cache, stakingPoolContract, 'addOrEditPool', {
    key: key.toBytes32('XD'),
    name: 'XD Staking',
    poolType: '0',
    stakingToken: npm.address,
    uniStakingTokenDollarPair: npmUsdPair.address,
    rewardToken: xd.address,
    uniRewardTokenDollarPair: xdUsdPair.address,
    stakingTarget: helper.ether(100_000_000),
    maxStake: helper.ether(100_000),
    platformFee: helper.percentage(0.25),
    rewardPerBlock: (18_559_222_222).toString(),
    lockupPeriod: minutesToBlocks(chainId, 90),
    rewardTokenToDeposit: helper.ether(19_000_000)
  })
}

module.exports = { setStakingPools }
