// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./StoreKeyUtil.sol";
import "./ProtoUtilV1.sol";
import "./NTransferUtilV2.sol";
import "./ValidationLibV1.sol";
import "./StakingPoolCoreLibV1.sol";

library StakingPoolLibV1 {
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using StakingPoolCoreLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  /**
   * @dev Gets the info of a given staking pool by key
   * @param s Specify the store instance
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
   * @param values[6] platformFee --> Returns the % rate (multipled by ProtoUtilV1.MULTIPLIER) charged by protocol on rewards
   * @param values[7] lockupPeriod --> Returns the period until when a stake can't be withdrawn
   * @param values[8] rewardTokenBalance --> Returns the balance of the reward tokens still left in the pool
   * @param values[9] accountStakeBalance --> Returns your stake amount
   * @param values[10] totalBlockSinceLastReward --> Returns the number of blocks since your last reward
   * @param values[11] rewards --> The amount of reward tokens you have accumulated till this block
   * @param values[12] canWithdrawFromBlockHeight --> The block height after which you are allowed to withdraw your stake
   * @param values[13] lastDepositHeight --> Returns the block number of your last deposit
   * @param values[14] lastRewardHeight --> Returns the block number of your last reward
   */
  function getInfoInternal(
    IStore s,
    bytes32 key,
    address you
  )
    external
    view
    returns (
      string memory name,
      address[] memory addresses,
      uint256[] memory values
    )
  {
    addresses = new address[](4);
    values = new uint256[](15);

    bool valid = s.checkIfStakingPoolExists(key);

    if (valid) {
      name = s.getStringByKeys(StakingPoolCoreLibV1.NS_POOL, key);

      addresses[0] = s.getStakingTokenAddressInternal(key);
      addresses[1] = s.getStakingTokenStablecoinPairAddressInternal(key);
      addresses[2] = s.getRewardTokenAddressInternal(key);
      addresses[3] = s.getRewardTokenStablecoinPairAddressInternal(key);

      values[0] = s.getTotalStaked(key);
      values[1] = s.getTarget(key);
      values[2] = s.getMaximumStakeInternal(key);
      values[3] = getPoolStakeBalanceInternal(s, key);
      values[4] = getPoolCumulativeDeposits(s, key);
      values[5] = s.getRewardPerBlock(key);
      values[6] = s.getRewardPlatformFee(key);
      values[7] = s.getLockupPeriodInBlocks(key);
      values[8] = s.getRewardTokenBalance(key);
      values[9] = getAccountStakingBalanceInternal(s, key, you);
      values[10] = getTotalBlocksSinceLastRewardInternal(s, key, you);
      values[11] = calculateRewardsInternal(s, key, you);
      values[12] = canWithdrawFromBlockHeightInternal(s, key, you);
      values[13] = getLastDepositHeight(s, key, you);
      values[14] = getLastRewardHeight(s, key, you);
    }
  }

  function getPoolStakeBalanceInternal(IStore s, bytes32 key) public view returns (uint256) {
    uint256 totalStake = s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key);
    return totalStake;
  }

  function getPoolCumulativeDeposits(IStore s, bytes32 key) public view returns (uint256) {
    uint256 totalStake = s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_CUMULATIVE_STAKING_AMOUNT, key);
    return totalStake;
  }

  function getAccountStakingBalanceInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    return s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, account);
  }

  function getTotalBlocksSinceLastRewardInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    uint256 from = getLastRewardHeight(s, key, account);

    if (from == 0) {
      return 0;
    }

    return block.number - from;
  }

  function canWithdrawFromBlockHeightInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    uint256 lastDepositHeight = getLastDepositHeight(s, key, account);

    if (lastDepositHeight == 0) {
      return 0;
    }

    uint256 lockupPeriod = s.getLockupPeriodInBlocks(key);

    return lastDepositHeight + lockupPeriod;
  }

  function getLastDepositHeight(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    return s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_DEPOSIT_HEIGHTS, key, account);
  }

  function getLastRewardHeight(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    return s.getUintByKeys(StakingPoolCoreLibV1.NS_POOL_REWARD_HEIGHTS, key, account);
  }

  function calculateRewardsInternal(
    IStore s,
    bytes32 key,
    address account
  ) public view returns (uint256) {
    uint256 totalBlocks = getTotalBlocksSinceLastRewardInternal(s, key, account);

    if (totalBlocks == 0) {
      return 0;
    }

    uint256 rewardPerBlock = s.getRewardPerBlock(key);
    uint256 myStake = getAccountStakingBalanceInternal(s, key, account);
    uint256 rewards = (myStake * rewardPerBlock * totalBlocks) / 1 ether;

    uint256 poolBalance = s.getRewardTokenBalance(key);

    return rewards > poolBalance ? poolBalance : rewards;
  }

  /**
   * @dev Withdraws the rewards of the caller (if any or if available).
   *
   *
   * @custom:suppress-malicious-erc The ERC-20 `rewardtoken` can't be manipulated via user input.
   *
   */
  function withdrawRewardsInternal(
    IStore s,
    bytes32 key,
    address account
  )
    public
    returns (
      address rewardToken,
      uint256 rewards,
      uint256 platformFee
    )
  {
    require(s.getRewardPlatformFee(key) <= ProtoUtilV1.MULTIPLIER, "Invalid reward platform fee");
    rewards = calculateRewardsInternal(s, key, account);

    s.setUintByKeys(StakingPoolCoreLibV1.NS_POOL_REWARD_HEIGHTS, key, account, block.number);

    if (rewards == 0) {
      return (address(0), 0, 0);
    }

    rewardToken = s.getAddressByKeys(StakingPoolCoreLibV1.NS_POOL_REWARD_TOKEN, key);

    // Update (decrease) the balance of reward token
    s.subtractUintByKeys(StakingPoolCoreLibV1.NS_POOL_REWARD_TOKEN_BALANCE, key, rewards);

    // Update total rewards given
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_TOTAL_REWARD_GIVEN, key, account, rewards); // To this account
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_TOTAL_REWARD_GIVEN, key, rewards); // To everyone

    // @suppress-division Checked side effects. If the reward platform fee is zero
    // or a very small number, platform fee becomes zero because of data loss
    platformFee = (rewards * s.getRewardPlatformFee(key)) / ProtoUtilV1.MULTIPLIER;

    // @suppress-subtraction If `getRewardPlatformFee` is 100%, the following can result in zero value.
    if (rewards - platformFee > 0) {
      IERC20(rewardToken).ensureTransfer(msg.sender, rewards - platformFee);
    }

    if (platformFee > 0) {
      IERC20(rewardToken).ensureTransfer(s.getTreasury(), platformFee);
    }
  }

  /**
   * @dev Deposit the specified amount of staking token to the specified pool.
   *
   * @custom:suppress-malicious-erc The ERC-20 `stakingToken` can't be manipulated via user input.
   *
   */
  function depositInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  )
    external
    returns (
      address stakingToken,
      address rewardToken,
      uint256 rewards,
      uint256 rewardsPlatformFee
    )
  {
    require(amount > 0, "Enter an amount");
    require(amount <= s.getMaximumStakeInternal(key), "Stake too high");
    require(amount <= s.getAvailableToStakeInternal(key), "Target achieved or cap exceeded");

    stakingToken = s.getStakingTokenAddressInternal(key);

    // First withdraw your rewards
    (rewardToken, rewards, rewardsPlatformFee) = withdrawRewardsInternal(s, key, msg.sender);

    // Individual state
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, msg.sender, amount);
    s.setUintByKeys(StakingPoolCoreLibV1.NS_POOL_DEPOSIT_HEIGHTS, key, msg.sender, block.number);

    // Global state
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, amount);
    s.addUintByKeys(StakingPoolCoreLibV1.NS_POOL_CUMULATIVE_STAKING_AMOUNT, key, amount);

    IERC20(stakingToken).ensureTransferFrom(msg.sender, address(this), amount);
  }

  /**
   * @dev Withdraw the specified amount of staking token from the specified pool.
   *
   * @custom:suppress-malicious-erc The ERC-20 `stakingToken` can't be manipulated via user input.
   *
   */
  function withdrawInternal(
    IStore s,
    bytes32 key,
    uint256 amount
  )
    external
    returns (
      address stakingToken,
      address rewardToken,
      uint256 rewards,
      uint256 rewardsPlatformFee
    )
  {
    require(amount > 0, "Please specify amount");

    require(getAccountStakingBalanceInternal(s, key, msg.sender) >= amount, "Insufficient balance");
    require(block.number >= canWithdrawFromBlockHeightInternal(s, key, msg.sender), "Withdrawal too early");

    stakingToken = s.getStakingTokenAddressInternal(key);

    // First withdraw your rewards
    (rewardToken, rewards, rewardsPlatformFee) = withdrawRewardsInternal(s, key, msg.sender);

    // @suppress-subtraction The maximum amount that can be withdrawn is the staked balance
    // and therefore underflow is not possible.
    // Individual state
    s.subtractUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, msg.sender, amount);

    // Global state
    s.subtractUintByKeys(StakingPoolCoreLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, amount);

    IERC20(stakingToken).ensureTransfer(msg.sender, amount);
  }
}
