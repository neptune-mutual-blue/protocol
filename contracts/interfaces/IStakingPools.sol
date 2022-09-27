// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface IStakingPools is IMember {
  enum StakingPoolType {
    TokenStaking,
    PODStaking
  }

  //Adds or edits the pool by key
  struct AddOrEditPoolArgs {
    bytes32 key; //Enter the key of the pool you want to create or edit
    string name; //Enter a name for this pool
    StakingPoolType poolType; //Specify the pool type: TokenStaking or PODStaking
    address stakingToken;  //The token which is staked in this pool
    address uniStakingTokenDollarPair; //Enter a Uniswap stablecoin pair address of the staking token
    address rewardToken; //The token which is rewarded in this pool
    address uniRewardTokenDollarPair; //Enter a Uniswap stablecoin pair address of the staking token
    uint256 stakingTarget; //Specify the target amount in the staking token. You can not exceed the target.
    uint256 maxStake; //Specify the maximum amount that can be staken at a time.
    uint256 platformFee; //Enter the platform fee which is deducted on reward and on the reward token
    uint256 rewardPerBlock; //Specify the amount of reward token awarded per block
    uint256 lockupPeriod; //Enter a lockup period during when the staked tokens can't be withdrawn
    uint256 rewardTokenToDeposit; //Enter the value of reward token you are depositing in this transaction.
  }

  struct StakingPoolInfoType {
    string name; //Returns the name of the staking pool
    address stakingToken; // Returns the address of the token which is staked in this pool
    address stakingTokenStablecoinPair; // Returns the pair address of the staking token and stablecoin
    address rewardToken; // Returns the address of the token which is rewarded in this pool
    address rewardTokenStablecoinPair; // Returns the pair address of the reward token and stablecoin
    uint256 totalStaked; // Returns the total units of staked tokens
    uint256 target; // Returns the target amount to stake (as staking token unit)
    uint256 maximumStake; // Returns the maximum amount of staking token units that can be added at a time
    uint256 stakeBalance; // Returns the amount of staking token currently locked in the pool
    uint256 cumulativeDeposits; // Returns the total amount tokens which were deposited in this pool
    uint256 rewardPerBlock; // Returns the unit of reward tokens awarded on each block for each unit of staking token
    uint256 platformFee; // Returns the % rate (multipled by ProtoUtilV1.PERCENTAGE_DIVISOR) charged by protocol on rewards
    uint256 lockupPeriod; // Returns the period until when a stake can't be withdrawn
    uint256 rewardTokenBalance; // Returns the balance of the reward tokens still left in the pool
    uint256 accountStakeBalance; // Returns your stake amount
    uint256 totalBlockSinceLastReward; // Returns the number of blocks since your last reward
    uint256 rewards; // The amount of reward tokens you have accumulated till this block
    uint256 canWithdrawFromBlockHeight; // The block height after which you are allowed to withdraw your stake
    uint256 lastDepositHeight; // Returns the block number of your last deposit
    uint256 lastRewardHeight; // Returns the block number of your last reward
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
