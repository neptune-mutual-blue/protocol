// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./StakingPoolInfo.sol";

contract StakingPools is StakingPoolInfo {
  using ValidationLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using StakingPoolLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  constructor(IStore s) StakingPoolInfo(s) {} //solhint-disable-line

  function deposit(bytes32 key, uint256 amount) external override nonReentrant {
    s.mustNotBePaused();
    s.ensureValidStakingPool(key);

    require(key > 0, "Invalid key");
    require(amount > 0, "Enter an amount");
    require(amount <= s.getMaximumStakeInternal(key), "Stake too high");
    require(amount <= s.getAvailableToStakeInternal(key), "Target achieved or cap exceeded");

    address stakingToken = s.getStakingTokenAddressInternal(key);

    // First withdraw your rewards
    s.withdrawRewardsInternal(key, msg.sender);

    // Individual state
    s.addUintByKeys(StakingPoolLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, msg.sender, amount);
    s.addUintByKeys(StakingPoolLibV1.NS_POOL_DEPOSIT_HEIGHTS, key, msg.sender, block.number);

    // Global state
    s.addUintByKeys(StakingPoolLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, amount);
    s.addUintByKeys(StakingPoolLibV1.NS_POOL_CUMULATIVE_STAKING_AMOUNT, key, amount);

    IERC20(stakingToken).ensureTransferFrom(msg.sender, address(this), amount);

    emit Deposited(key, msg.sender, stakingToken, amount);
  }

  function withdraw(bytes32 key, uint256 amount) external override nonReentrant {
    s.mustNotBePaused();
    s.ensureValidStakingPool(key);

    require(key > 0, "Invalid key");
    require(amount > 0, "Enter an amount");

    require(s.getAccountStakingBalanceInternal(key, msg.sender) >= amount, "Insufficient balance");
    require(block.number > s.canWithdrawFromInternal(key, msg.sender), "Withdrawal too early");

    address stakingToken = s.getStakingTokenAddressInternal(key);

    // First withdraw your rewards
    s.withdrawRewardsInternal(key, msg.sender);

    // Individual state
    s.subtractUintByKeys(StakingPoolLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, msg.sender, amount);

    // Global state
    s.subtractUintByKeys(StakingPoolLibV1.NS_POOL_STAKING_TOKEN_BALANCE, key, amount);

    IERC20(stakingToken).ensureTransfer(msg.sender, amount);

    emit Withdrawn(key, msg.sender, stakingToken, amount);
  }
}
