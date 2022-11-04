/* eslint-disable no-unused-expressions */

const BigNumber = require('bignumber.js')
const { ethers, network } = require('hardhat')
const composer = require('../../util/composer')
const { helper, key } = require('../../util')
const { minutesToBlocks } = require('../../util/block-time')

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

    const args = {
      key: key.toBytes32('CPOOL'),
      name: 'Clearpool Staking',
      poolType: '0',
      stakingToken: contracts.tokens.npm.address,
      uniStakingTokenDollarPair: contracts.npmUsdPair.address,
      rewardToken: contracts.tokens.crpool.address,
      uniRewardTokenDollarPair: contracts.crpoolUsdPair.address,
      stakingTarget: helper.ether(4_000_000),
      maxStake: helper.ether(10_000),
      platformFee: helper.percentage(0.5),
      rewardPerBlock: (12_345_678).toString(),
      lockupPeriod: minutesToBlocks(31337, 5),
      rewardTokenToDeposit: helper.ether(10_000_000)
    }

    await contracts.tokens.crpool.approve(contracts.stakingPoolContract.address, args.rewardTokenToDeposit)
    await contracts.tokens.hwt.approve(contracts.stakingPoolContract.address, args.rewardTokenToDeposit)

    await contracts.stakingPoolContract.addOrEditPool(args)

    await contracts.stakingPoolContract.addOrEditPool({
      ...args,
      key: key.toBytes32('HWT'),
      name: key.toBytes32('HWT Staking'),
      rewardToken: contracts.tokens.hwt.address,
      uniRewardTokenDollarPair: contracts.hwtUsdPair.address
    })

    const info = await contracts.stakingPoolContract.getInfo(args.key, owner.address)

    info.name.should.equal(args.name)
    info.totalStaked.should.equal('0')
    info.target.should.equal(args.stakingTarget)
    info.maximumStake.should.equal(args.maxStake)
    info.stakeBalance.should.equal('0')
    info.cumulativeDeposits.should.equal('0')
    info.rewardPerBlock.should.equal(args.rewardPerBlock)
    info.platformFee.should.equal(args.platformFee)
    info.lockupPeriod.should.equal(args.lockupPeriod)
    info.rewardTokenBalance.should.gte(args.rewardTokenToDeposit)
    info.accountStakeBalance.should.equal('0')
    info.totalBlockSinceLastReward.should.equal('0')
    info.rewards.should.equal('0')
    info.canWithdrawFromBlockHeight.should.equal('0')
    info.lastDepositHeight.should.equal('0')
    info.lastRewardHeight.should.equal('0')
  })

  it('admin staked some tokens', async () => {
    const arg = {
      key: key.toBytes32('CPOOL'),
      amount: helper.ether(100)
    }

    await contracts.tokens.npm.approve(contracts.stakingPoolContract.address, arg.amount)
    await contracts.stakingPoolContract.deposit(arg.key, arg.amount)
  })

  it('the admin received some rewards', async () => {
    const [owner] = await ethers.getSigners()
    await mineBlocks(10)
    const rewards = await contracts.stakingPoolContract.calculateRewards(key.toBytes32('CPOOL'), owner.address)

    rewards.should.gt('0')
  })
})
