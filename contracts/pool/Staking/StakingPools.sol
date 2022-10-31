// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./StakingPoolInfo.sol";

contract StakingPools is StakingPoolInfo {
  using ValidationLibV1 for IStore;
  using StakingPoolCoreLibV1 for IStore;
  using StakingPoolLibV1 for IStore;

  constructor(IStore s) StakingPoolInfo(s) {} //solhint-disable-line

  /**
   * @dev Deposit your desired amount of tokens to the specified staking pool.
   * When you deposit, you receive rewards if tokens are still available in the reward pool.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   */
  function deposit(bytes32 key, uint256 amount) external override nonReentrant {
    s.mustNotBePaused();
    s.ensureValidStakingPoolInternal(key);

    (address stakingToken, address rewardToken, uint256 rewards, uint256 rewardsPlatformFee) = s.depositInternal(key, amount);
    emit Deposited(key, msg.sender, stakingToken, amount);

    if (rewards > 0) {
      emit RewardsWithdrawn(key, msg.sender, rewardToken, rewards, rewardsPlatformFee);
    }
  }

  /**
   * @dev Withdraw your desired amount of tokens from the staking pool.
   * When you withdraw, you receive rewards if tokens are still available in the reward pool.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   */
  function withdraw(bytes32 key, uint256 amount) external override nonReentrant {
    s.mustNotBePaused();
    s.ensureValidStakingPoolInternal(key);

    (address stakingToken, address rewardToken, uint256 rewards, uint256 rewardsPlatformFee) = s.withdrawInternal(key, amount);
    emit Withdrawn(key, msg.sender, stakingToken, amount);

    if (rewards > 0) {
      emit RewardsWithdrawn(key, msg.sender, rewardToken, rewards, rewardsPlatformFee);
    }
  }
}
