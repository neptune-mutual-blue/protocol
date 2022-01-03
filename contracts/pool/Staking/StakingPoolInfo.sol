// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./StakingPoolReward.sol";

abstract contract StakingPoolInfo is StakingPoolReward {
  using StakingPoolLibV1 for IStore;

  constructor(IStore s) StakingPoolReward(s) {} //solhint-disable-line

  /**
   * @dev Reports the remaining amount of tokens that can be staked in this pool
   */
  function getAvailableToStake(bytes32 key) external view override returns (uint256) {
    return s.getAvailableToStakeInternal(key);
  }

  function getTotalBlocksSinceLastReward(bytes32 key, address account) external view override returns (uint256) {
    return s.getTotalBlocksSinceLastRewardInternal(key, account);
  }

  function getPoolStakeBalance(bytes32 key) external view override returns (uint256) {
    return s.getPoolStakeBalanceInternal(key);
  }

  function canWithdrawFrom(bytes32 key, address account) external view override returns (uint256) {
    return s.canWithdrawFromInternal(key, account);
  }

  function getAccountStakingBalance(bytes32 key, address account) external view override returns (uint256) {
    return s.getAccountStakingBalanceInternal(key, account);
  }
}
