/* eslint-disable no-unused-expressions */
const { ethers } = require('hardhat')
const BigNumber = require('bignumber.js')
const { helper, deployer, key } = require('../../../../util')
const { minutesToBlocks } = require('../../../../util/block-time')
const pair = require('../../../../util/composer/uniswap-pair')
const { deployDependencies, PoolTypes } = require('./deps')
const cache = null

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

describe('Close Pool', () => {
  let pool, payload, deployed, dai, npmDai, sabre, sabreDai

  before(async () => {
    deployed = await deployDependencies()

    const [owner] = await ethers.getSigners()
    dai = await deployer.deploy(cache, 'FakeToken', 'DAI', 'DAI', helper.ether(100_000_000), 6)
    ;[[npmDai]] = await pair.deploySeveral(cache, [{ token0: deployed.npm.address, token1: dai.address }])
    sabre = await deployer.deploy(cache, 'FakeToken', 'Sabre Oracles', 'SABRE', helper.ether(100_000_000), 18)
    ;[[sabreDai]] = await pair.deploySeveral(cache, [{ token0: sabre.address, token1: dai.address }])

    pool = await deployer.deployWithLibraries(cache, 'StakingPools', {
      AccessControlLibV1: deployed.accessControlLibV1.address,
      BaseLibV1: deployed.baseLibV1.address,
      StakingPoolCoreLibV1: deployed.stakingPoolCoreLibV1.address,
      StakingPoolLibV1: deployed.stakingPoolLibV1.address,
      StoreKeyUtil: deployed.storeKeyUtil.address,
      ValidationLibV1: deployed.validationLibV1.address
    }, deployed.store.address)

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, owner.address)
    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UPGRADE_AGENT, deployed.protocol.address)
    await deployed.protocol.addContract(key.PROTOCOL.CNS.STAKING_POOL, pool.address)

    payload = {
      key: key.toBytes32('NPM Staking Pool'),
      name: 'NPM Staking Pool',
      poolType: PoolTypes.Token,
      addresses: [
        deployed.npm.address, // Staking Token
        npmDai.address, // uniStakingTokenDollarPair
        sabre.address, // rewardToken
        sabreDai.address // uniRewardTokenDollarPair
      ],
      values: [
        helper.ether(4_000_000), // 4M NPM target
        helper.ether(10_000), // Max 10_000 per transaction
        helper.percentage(0.5), // Platform fee
        (12_345_678).toString(), // Reward per block
        minutesToBlocks(31337, 5), // 5 minutes lockup period
        helper.ether(10_000_000) // Deposit 10M sabre tokens
      ]
    }

    await sabre.approve(pool.address, ethers.constants.MaxUint256)
    await pool.addOrEditPool(payload.key, payload.name, payload.poolType, payload.addresses, payload.values)
  })

  it('must correctly close a pool', async () => {
    const [owner] = await ethers.getSigners()
    const tx = await pool.closePool(payload.key)

    const { events } = await tx.wait()
    const event = events.pop()

    event.args.key.should.equal(payload.key)
    event.args.name.should.equal(payload.name)

    const info = await pool.getInfo(payload.key, owner.address)

    const [
      name,
      [stakingToken, stakingTokenStablecoinPair, rewardToken, rewardTokenStablecoinPair],
      [totalStaked, target, maximumStake, stakeBalance, cumulativeDeposits, rewardPerBlock, platformFee, lockupPeriod, rewardTokenBalance, accountStakeBalance]
    ] = info

    name.should.equal('')
    stakingToken.should.equal(helper.zerox)
    stakingTokenStablecoinPair.should.equal(helper.zerox)
    rewardToken.should.equal(helper.zerox)
    rewardTokenStablecoinPair.should.equal(helper.zerox)
    totalStaked.should.equal('0')
    target.should.equal('0')
    maximumStake.should.equal('0')
    stakeBalance.should.equal('0')
    cumulativeDeposits.should.equal('0')
    rewardPerBlock.should.equal('0')
    platformFee.should.equal('0')
    lockupPeriod.should.equal('0')
    rewardTokenBalance.should.equal('0')
    accountStakeBalance.should.equal('0')
  })

  it('must reject if the protocol is paused', async () => {
    const [owner] = await ethers.getSigners()

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.PAUSE_AGENT, owner.address)
    await deployed.protocol.pause()
    await pool.closePool(payload.key).should.be.rejectedWith('Protocol is paused')

    await deployed.protocol.grantRole(key.ACCESS_CONTROL.UNPAUSE_AGENT, owner.address)
    await deployed.protocol.unpause()
  })

  it('must reject if accessed by non admins', async () => {
    const [, bob] = await ethers.getSigners()

    await pool.connect(bob).closePool(payload.key).should.be.rejectedWith('Forbidden')
  })

  it('must reject to delete unknown pools', async () => {
    await pool.closePool(key.toBytes32('test')).should.be.rejectedWith('Unknown Pool')
  })
})
