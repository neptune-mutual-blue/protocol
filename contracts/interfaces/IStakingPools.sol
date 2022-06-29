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
    uint256 lockupPeriodInBlocks,
    uint256 platformFee
  );

  event PoolClosed(bytes32 indexed key, string name);
  event Deposited(bytes32 indexed key, address indexed account, address indexed token, uint256 amount);
  event Withdrawn(bytes32 indexed key, address indexed account, address indexed token, uint256 amount);
  event RewardsWithdrawn(bytes32 indexed key, address indexed account, address indexed token, uint256 rewards, uint256 platformFee);

  /**
   * @dev Adds or edits the pool by key
   * @param coverKey Enter the key of the pool you want to create or edit
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
    bytes32 coverKey,
    string calldata name,
    StakingPoolType poolType,
    address[] calldata addresses,
    uint256[] calldata values
  ) external;

  function closePool(bytes32 coverKey) external;

  function deposit(bytes32 coverKey, uint256 amount) external;

  function withdraw(bytes32 coverKey, uint256 amount) external;

  function withdrawRewards(bytes32 coverKey) external;

  function calculateRewards(bytes32 coverKey, address account) external view returns (uint256);

  /**
   * @dev Gets the info of a given staking pool by key
   * @param coverKey Provide the staking pool key to fetch info for
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
   * @param values[7] lockupPeriodInBlocks --> Returns the period until when a stake can't be withdrawn
   * @param values[8] rewardTokenBalance --> Returns the balance of the reward tokens still left in the pool
   * @param values[9] accountStakeBalance --> Returns your stake amount
   * @param values[10] totalBlockSinceLastReward --> Returns the number of blocks since your last reward
   * @param values[11] rewards --> The amount of reward tokens you have accumulated till this block
   * @param values[12] canWithdrawFromBlockHeight --> The block height after which you are allowed to withdraw your stake
   * @param values[13] lastDepositHeight --> Returns the block number of your last deposit
   * @param values[14] lastRewardHeight --> Returns the block number of your last reward
   */
  function getInfo(bytes32 coverKey, address you)
    external
    view
    returns (
      string memory name,
      address[] memory addresses,
      uint256[] memory values
    );
}
