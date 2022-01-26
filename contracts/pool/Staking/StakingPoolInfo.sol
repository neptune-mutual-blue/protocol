// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./StakingPoolReward.sol";

abstract contract StakingPoolInfo is StakingPoolReward {
  using StakingPoolCoreLibV1 for IStore;
  using StakingPoolLibV1 for IStore;

  constructor(IStore s) StakingPoolReward(s) {} //solhint-disable-line

  /**
   * @dev Gets the info of a given staking pool by key
   * @param key Provide the staking pool key to fetch info for
   * @param you Specify the address to customize the info for
   * @param name Returns the name of the staking pool
   * @param addresses[0] stakingToken --> Returns the address of the token which is staked in this pool
   * @param addresses[1] stakingTokenStablecoinPair --> Returns the pair address of the staking token and stablecoin
   * @param addresses[2] rewardToken --> Returns the address of the token which is rewarded in this pool
   * @param addresses[3] rewardTokenStablecoinPair --> Returns the pair address of the reward token and stablecoin
   * @param values[0] totalStaked --> Returns the total units of staked tokens
   * @param values[1] target --> Returns the target amount to stake (as staking token unit)
   * @param values[2] maximumStake --> Returns the maximum amount of staking token units that can be added at a time
   * @param values[3] stakeBalance --> Returns the amount of staking token currently locked in the pool
   * @param values[4] cumulativeDeposits --> Returns the total amount tokens which were deposited in this pool
   * @param values[5] rewardPerBlock --> Returns the unit of reward tokens awarded on each block for each unit of staking token
   * @param values[6] platformFee --> Returns the % rate (multipled by ProtoUtilV1.PERCENTAGE_DIVISOR) charged by protocol on rewards
   * @param values[7] lockupPeriod --> Returns the period until when a stake can't be withdrawn
   * @param values[8] rewardTokenBalance --> Returns the balance of the reward tokens still left in the pool
   * @param values[9] accountStakeBalance --> Returns your stake amount
   * @param values[10] totalBlockSinceLastReward --> Returns the number of blocks since your last reward
   * @param values[11] rewards --> The amount of reward tokens you have accumulated till this block
   * @param values[12] canWithdrawFromBlockHeight --> The block height after which you are allowed to withdraw your stake
   * @param values[13] lastDepositHeight --> Returns the block number of your last deposit
   * @param values[14] lastRewardHeight --> Returns the block number of your last reward
   */
  function getInfo(bytes32 key, address you)
    external
    view
    override
    returns (
      string memory name,
      address[] memory addresses,
      uint256[] memory values
    )
  {
    return s.getInfoInternal(key, you);
  }
}
