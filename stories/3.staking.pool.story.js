/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
const { ethers, network } = require('hardhat')
const composer = require('../util/composer')
const { helper, key } = require('../util')
const { minutesToBlocks } = require('../util/block-time')
const poolKey = key.toBytes32('Cpool')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

async function mineBlocks (totalBlocks) {
  while (totalBlocks > 0) {
    totalBlocks--
    await network.provider.request({
      method: 'evm_mine',
      params: []
    })
  }
}

describe('Staking Pool Stories', () => {
  let contracts

  before(async () => {
    contracts = await composer.initializer.initialize(true)
  })

  it('correly deploys', async () => {
    contracts.stakingPoolContract.should.not.equal(helper.zerox)
  })

  it('correctly created a new pool: Clearpool Staking', async () => {
    const [owner] = await ethers.getSigners()

    const arg = {
      stakingTarget: helper.ether(100_000_000),
      maxStake: helper.ether(100_000),
      platformFee: helper.percentage(0.25),
      rewardPerBlock: 342,
      lockupPeriodInBlocks: minutesToBlocks(31337, 5),
      rewardTokenDeposit: helper.ether(30_000_000),
      poolKey,
      name: key.toBytes32('Clearpool Staking')
    }

    arg.addresses = [contracts.npm.address, contracts.npmUsdPair.address, contracts.cpool.address, contracts.cpoolUsdPair.address]
    arg.addresses2 = [contracts.npm.address, contracts.npmUsdPair.address, contracts.ht.address, contracts.htUsdPair.address]
    arg.values = [arg.stakingTarget, arg.maxStake, arg.platformFee, arg.rewardPerBlock, arg.lockupPeriodInBlocks, arg.rewardTokenDeposit]

    await contracts.cpool.approve(contracts.stakingPoolContract.address, arg.rewardTokenDeposit)
    await contracts.ht.approve(contracts.stakingPoolContract.address, arg.rewardTokenDeposit)

    await contracts.stakingPoolContract.addOrEditPool(arg.poolKey, arg.name, 0, arg.addresses, arg.values)
    await contracts.stakingPoolContract.addOrEditPool(key.toBytes32('HT'), key.toBytes32('HT Staking'), 0, arg.addresses2, arg.values)

    const info = await contracts.stakingPoolContract.getInfo(arg.poolKey, owner.address)
    const [name, addresses, values] = info
    const [totalStaked, target, maximumStake, stakeBalance, cumulativeDeposits, rewardPerBlock,
      platformFee, lockupPeriod, rewardTokenBalance, accountStakeBalance, totalBlockSinceLastReward,
      rewards, canWithdrawFromBlockHeight, lastDepositHeight, lastRewardHeight] = values

    name.should.equal(arg.name)
    addresses.should.deep.equal(arg.addresses)

    totalStaked.should.equal('0')
    target.should.equal(arg.stakingTarget)
    maximumStake.should.equal(arg.maxStake)
    stakeBalance.should.equal('0')
    cumulativeDeposits.should.equal('0')
    rewardPerBlock.should.equal(arg.rewardPerBlock)
    platformFee.should.equal(arg.platformFee)
    lockupPeriod.should.equal(arg.lockupPeriodInBlocks)
    rewardTokenBalance.should.gte(arg.rewardTokenDeposit)
    accountStakeBalance.should.equal('0')
    totalBlockSinceLastReward.should.equal('0')
    rewards.should.equal('0')
    canWithdrawFromBlockHeight.should.equal('0')
    lastDepositHeight.should.equal('0')
    lastRewardHeight.should.equal('0')
  })

  it('admin staked some tokens', async () => {
    const arg = {
      poolKey,
      amount: helper.ether(99_999)
    }

    await contracts.npm.approve(contracts.stakingPoolContract.address, arg.amount)
    await contracts.stakingPoolContract.deposit(arg.poolKey, arg.amount)
  })

  it('the admin received some rewards', async () => {
    const [owner] = await ethers.getSigners()
    await mineBlocks(10)
    const rewards = await contracts.stakingPoolContract.calculateRewards(poolKey, owner.address)

    rewards.should.gt('0')
  })
})
