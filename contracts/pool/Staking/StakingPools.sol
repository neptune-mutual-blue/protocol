// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./StakingPoolInfo.sol";

contract StakingPools is StakingPoolInfo {
  using ValidationLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using StakingPoolCoreLibV1 for IStore;
  using StakingPoolLibV1 for IStore;

  constructor(IStore s) StakingPoolInfo(s) {} //solhint-disable-line

  function deposit(bytes32 key, uint256 amount) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.ensureValidStakingPool(key);

    address stakingToken = s.depositInternal(key, amount);
    emit Deposited(key, msg.sender, stakingToken, amount);
  }

  function withdraw(bytes32 key, uint256 amount) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.ensureValidStakingPool(key);

    address stakingToken = s.withdrawInternal(key, amount);
    emit Withdrawn(key, msg.sender, stakingToken, amount);
  }
}
