// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IMember.sol";

interface IStakingPools is IMember {
  enum StakingPoolType {
    TokenStaking,
    PODStaking
  }

  event PoolUpdated(
    bytes32 indexed key,
    string name,
    StakingPoolType poolType,
    address indexed stakingToken,
    address uniStakingTokenDollarPair,
    address indexed rewardToken,
    address uniRewardTokenDollarPair,
    uint256 rewardTokenDeposit,
    uint256 maxStake,
    uint256 rewardPerBlock,
    uint256 platformFee
  );

  event PoolClosed(bytes32 indexed key, string name);

  /**
   * @dev Adds or edits the pool by key
   * @param key Enter the key of the pool you want to create or edit
   * @param name Enter a name for this pool
   * @param poolType Specify the pool type: TokenStaking or PODStaking
   * @param addresses[0] stakingToken The token which is staked in this pool
   * @param addresses[1] uniStakingTokenDollarPair Enter a Uniswap stablecoin pair address of the staking token
   * @param addresses[2] rewardToken The token which is rewarded in this pool
   * @param addresses[3] uniRewardTokenDollarPair Enter a Uniswap stablecoin pair address of the staking token
   * @param values[0] stakingTarget Specify the target amount in the staking token. You can not exceed the target.
   * @param values[1] maxStake Specify the maximum amount that can be staken at a time.
   * @param values[2] platformFee Enter the platform fee which is deducted on reward and on the reward token
   * @param values[3] rewardPerBlock Specify the amount of reward token awarded per block
   * @param values[4] lockupPeriod Enter a lockup period during when the staked tokens can't be withdrawn
   * @param values[5] rewardTokenDeposit Enter the value of reward token you are depositing in this transaction.
   */
  function addOrEditPool(
    bytes32 key,
    string memory name,
    StakingPoolType poolType,
    address[] memory addresses,
    uint256[] memory values
  ) external;

  function closePool(bytes32 key) external;

  function validateAddOrEditPool(
    bytes32 key,
    string memory name,
    address[] memory addresses,
    uint256[] memory values
  ) external view returns (bool);

  function deposit(bytes32 key, uint256 amount) external;

  function withdraw(bytes32 key, uint256 amount) external;

  function withdrawRewards(bytes32 key) external;

  function calculateRewards(bytes32 key, address account) external view returns (uint256);

  function getAvailableToStake(bytes32 key) external view returns (uint256);

  function getTotalBlocksSinceLastReward(bytes32 key, address account) external view returns (uint256);

  function getAccountStakingBalance(bytes32 key, address account) external view returns (uint256);

  function getPoolStakeBalance(bytes32 key) external view returns (uint256);

  function canWithdrawFrom(bytes32 key, address account) external view returns (uint256);

  event Deposited(bytes32 indexed key, address indexed account, address indexed token, uint256 amount);
  event Withdrawn(bytes32 indexed key, address indexed account, address indexed token, uint256 amount);
  event RewardsWithdrawn(bytes32 indexed key, address indexed account, address indexed token, uint256 rewards, uint256 platformFee);
}
