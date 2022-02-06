const { ethers } = require('ethers')
const { covers } = require('../../examples/covers')
const ipfs = require('../ipfs')

const createCovers = async (payload) => {
  const { intermediate, cache, contracts } = payload
  const { dai, npm, reassuranceContract, stakingContract, cover } = contracts

  await intermediate(cache, dai, 'approve', cover.address, ethers.constants.MaxUint256)
  await intermediate(cache, dai, 'approve', reassuranceContract.address, ethers.constants.MaxUint256)
  await intermediate(cache, npm, 'approve', stakingContract.address, ethers.constants.MaxUint256)

  for (const i in covers) {
    const info = covers[i]
    console.info('Creating', info.coverName)
    await create(payload, info)
  }
}

const create = async (payload, info) => {
  const { intermediate, cache, contracts } = payload
  const { dai, cover } = contracts

  const { key } = info
  const { minReportingStake, reportingPeriod, stakeWithFees, reassurance, initialLiquidity } = info
  const hashBytes32 = await ipfs.write(info)

  const values = [minReportingStake.toString(),
    reportingPeriod.toString(),
    stakeWithFees.toString(),
    reassurance.toString(),
    initialLiquidity.toString()]

  await intermediate(cache, cover, 'addCover', key, hashBytes32, dai.address, values)
}

module.exports = { createCovers }
