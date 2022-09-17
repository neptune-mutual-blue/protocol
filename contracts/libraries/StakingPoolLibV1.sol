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
   *
   */
  function getInfoInternal(
    IStore s,
    bytes32 key,
    address you
  ) external view returns (IStakingPools.StakingPoolInfoType memory info) {
    bool valid = s.checkIfStakingPoolExists(key);

    if (valid) {
      info.name = s.getStringByKeys(StakingPoolCoreLibV1.NS_POOL, key);

      info.stakingToken = s.getStakingTokenAddressInternal(key);
      info.stakingTokenStablecoinPair = s.getStakingTokenStablecoinPairAddressInternal(key);
      info.rewardToken = s.getRewardTokenAddressInternal(key);
      info.rewardTokenStablecoinPair = s.getRewardTokenStablecoinPairAddressInternal(key);

      info.totalStaked = s.getTotalStaked(key);
      info.target = s.getTarget(key);
      info.maximumStake = s.getMaximumStakeInternal(key);
      info.stakeBalance = getPoolStakeBalanceInternal(s, key);
      info.cumulativeDeposits = getPoolCumulativeDeposits(s, key);
      info.rewardPerBlock = s.getRewardPerBlock(key);
      info.platformFee = s.getRewardPlatformFee(key);
      info.lockupPeriod = s.getLockupPeriodInBlocks(key);
      info.rewardTokenBalance = s.getRewardTokenBalance(key);
      info.accountStakeBalance = getAccountStakingBalanceInternal(s, key, you);
      info.totalBlockSinceLastReward = getTotalBlocksSinceLastRewardInternal(s, key, you);
      info.rewards = calculateRewardsInternal(s, key, you);
      info.canWithdrawFromBlockHeight = canWithdrawFromBlockHeightInternal(s, key, you);
      info.lastDepositHeight = getLastDepositHeight(s, key, you);
      info.lastRewardHeight = getLastRewardHeight(s, key, you);
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
