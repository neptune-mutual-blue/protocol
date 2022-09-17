// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/IStakingPools.sol";
import "../../libraries/AccessControlLibV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/StakingPoolCoreLibV1.sol";
import "../../libraries/StakingPoolLibV1.sol";
import "../../core/Recoverable.sol";

abstract contract StakingPoolBase is IStakingPools, Recoverable {
  using AccessControlLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using StakingPoolCoreLibV1 for IStore;
  using StakingPoolLibV1 for IStore;

  constructor(IStore s) Recoverable(s) {} //solhint-disable-line

  /**
   * @dev Adds or edits the pool by key
   */
  function addOrEditPool(AddOrEditPoolArgs calldata args) external override nonReentrant {
    // @suppress-zero-value-check The uint values are checked in the function `addOrEditPoolInternal`
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.addOrEditPoolInternal(args);
    emit PoolUpdated(args.key, args);
  }

  function closePool(bytes32 key) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);
    require(s.getBoolByKeys(StakingPoolCoreLibV1.NS_POOL, key), "Unknown Pool");
    require(s.getPoolStakeBalanceInternal(key) == 0, "Pool is not empty");

    s.deleteBoolByKeys(StakingPoolCoreLibV1.NS_POOL, key);
    emit PoolClosed(key, s.getStringByKeys(StakingPoolCoreLibV1.NS_POOL, key));
  }

  /**
   * @dev Version number of this contract
   */
  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  /**
   * @dev Name of this contract
   */
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_STAKING_POOL;
  }
}
