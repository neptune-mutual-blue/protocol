// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface IStakingPools is IMember {
  enum StakingPoolType {
    TokenStaking,
    PODStaking
  }

/**
   * Adds or edits the pool by key
   * key: Enter the key of the pool you want to create or edit
   * name Enter a name for this pool
   * poolType Specify the pool type: TokenStaking or PODStaking
   * stakingToken The token which is staked in this pool
   * uniStakingTokenDollarPair Enter a Uniswap stablecoin pair address of the staking token
   * rewardToken The token which is rewarded in this pool
   * uniRewardTokenDollarPair Enter a Uniswap stablecoin pair address of the staking token
   * stakingTarget Specify the target amount in the staking token. You can not exceed the target.
   * maxStake Specify the maximum amount that can be staken at a time.
   * platformFee Enter the platform fee which is deducted on reward and on the reward token
   * rewardPerBlock Specify the amount of reward token awarded per block
   * lockupPeriod Enter a lockup period during when the staked tokens can't be withdrawn
   * rewardTokenDeposit Enter the value of reward token you are depositing in this transaction.
   */

  struct AddOrEditPoolArgs {
    bytes32 key;
    string name;
    StakingPoolType poolType;
    address stakingToken;
    address uniStakingTokenDollarPair;
    address rewardToken;
    address uniRewardTokenDollarPair;
    uint256 stakingTarget;
    uint256 maxStake;
    uint256 platformFee;
    uint256 rewardPerBlock;
    uint256 lockupPeriod;
    uint256 rewardTokenToDeposit;
  }

  /*
   * name Returns the name of the staking pool
   * stakingToken --> Returns the address of the token which is staked in this pool
   * stakingTokenStablecoinPair --> Returns the pair address of the staking token and stablecoin
   * rewardToken --> Returns the address of the token which is rewarded in this pool
   * rewardTokenStablecoinPair --> Returns the pair address of the reward token and stablecoin
   * totalStaked --> Returns the total units of staked tokens
   * target --> Returns the target amount to stake (as staking token unit)
   * maximumStake --> Returns the maximum amount of staking token units that can be added at a time
   * stakeBalance --> Returns the amount of staking token currently locked in the pool
   * cumulativeDeposits --> Returns the total amount tokens which were deposited in this pool
   * rewardPerBlock --> Returns the unit of reward tokens awarded on each block for each unit of staking token
   * platformFee --> Returns the % rate (multipled by ProtoUtilV1.PERCENTAGE_DIVISOR) charged by protocol on rewards
   * lockupPeriodInBlocks --> Returns the period until when a stake can't be withdrawn
   * rewardTokenBalance --> Returns the balance of the reward tokens still left in the pool
   * accountStakeBalance --> Returns your stake amount
   * totalBlockSinceLastReward --> Returns the number of blocks since your last reward
   * rewards --> The amount of reward tokens you have accumulated till this block
   * canWithdrawFromBlockHeight --> The block height after which you are allowed to withdraw your stake
   * lastDepositHeight --> Returns the block number of your last deposit
   * lastRewardHeight --> Returns the block number of your last reward
   */
  struct StakingPoolInfoType {
    string name;
    address stakingToken;
    address stakingTokenStablecoinPair;
    address rewardToken;
    address rewardTokenStablecoinPair;
    uint256 totalStaked;
    uint256 target;
    uint256 maximumStake;
    uint256 stakeBalance;
    uint256 cumulativeDeposits;
    uint256 rewardPerBlock;
    uint256 platformFee;
    uint256 lockupPeriod;
    uint256 rewardTokenBalance;
    uint256 accountStakeBalance;
    uint256 totalBlockSinceLastReward;
    uint256 rewards;
    uint256 canWithdrawFromBlockHeight;
    uint256 lastDepositHeight;
    uint256 lastRewardHeight;
  }

  event PoolUpdated(bytes32 indexed key, AddOrEditPoolArgs args);

  event PoolClosed(bytes32 indexed key, string name);
  event Deposited(bytes32 indexed key, address indexed account, address indexed token, uint256 amount);
  event Withdrawn(bytes32 indexed key, address indexed account, address indexed token, uint256 amount);
  event RewardsWithdrawn(bytes32 indexed key, address indexed account, address indexed token, uint256 rewards, uint256 platformFee);

  /**
   * @dev Adds or edits the pool by key
   */
  function addOrEditPool(AddOrEditPoolArgs calldata args) external;

  function closePool(bytes32 key) external;

  function deposit(bytes32 key, uint256 amount) external;

  function withdraw(bytes32 key, uint256 amount) external;

  function withdrawRewards(bytes32 key) external;

  function calculateRewards(bytes32 key, address account) external view returns (uint256);

  /**
   * @dev Gets the info of a given staking pool by key
   * @param key Provide the staking pool key to fetch info for
   * @param you Specify the address to customize the info for
   */
  function getInfo(bytes32 key, address you) external view returns (StakingPoolInfoType memory info);
}
