// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./StakingPoolBase.sol";

abstract contract StakingPoolReward is StakingPoolBase {
  using ValidationLibV1 for IStore;
  using StakingPoolCoreLibV1 for IStore;
  using StakingPoolLibV1 for IStore;

  constructor(IStore s) StakingPoolBase(s) {} //solhint-disable-line

  function calculateRewards(bytes32 key, address account) external view override returns (uint256) {
    return s.calculateRewardsInternal(key, account);
  }

  function withdrawRewards(bytes32 key) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.ensureValidStakingPool(key);

    (address rewardToken, uint256 rewards, uint256 platformFee) = s.withdrawRewardsInternal(key, msg.sender);

    emit RewardsWithdrawn(key, msg.sender, rewardToken, rewards, platformFee);
  }
}
