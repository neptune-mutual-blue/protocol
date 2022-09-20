// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface IStakingPools is IMember {
  enum StakingPoolType {
    TokenStaking,
    PODStaking
  }

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
