// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./StakingPoolBase.sol";

abstract contract StakingPoolReward is StakingPoolBase {
  using ValidationLibV1 for IStore;
  using StakingPoolCoreLibV1 for IStore;
  using StakingPoolLibV1 for IStore;

  constructor(IStore s) StakingPoolBase(s) {} //solhint-disable-line

  function calculateRewards(bytes32 key, address account) external view override returns (uint256) {
    return s.calculateRewardsInternal(key, account);
  }

  /**
   * @dev Withdraw your staking reward. Ensure that you preiodically call this function
   * or else you risk receiving no rewards as a result of token depletion in the reward pool.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   */
  function withdrawRewards(bytes32 key) external override nonReentrant {
    s.mustNotBePaused();
    s.ensureValidStakingPoolInternal(key);

    (address rewardToken, uint256 rewards, uint256 platformFee) = s.withdrawRewardsInternal(key, msg.sender);

    if (rewards > 0) {
      emit RewardsWithdrawn(key, msg.sender, rewardToken, rewards, platformFee);
    }
  }
}
