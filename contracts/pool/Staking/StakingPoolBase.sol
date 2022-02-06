// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
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

  constructor(IStore s) Recoverable(s) {} //solhint-disable-line

  /**
   * @dev Adds or edits the pool by key
   * @param key Enter the key of the pool you want to create or edit
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
   * @param values[4] lockupPeriodInBlocks Enter a lockup period during when the staked tokens can't be withdrawn
   * @param values[5] rewardTokenDeposit Enter the value of reward token you are depositing in this transaction.
   */
  function addOrEditPool(
    bytes32 key,
    string memory name,
    StakingPoolType poolType,
    address[] memory addresses,
    uint256[] memory values
  ) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeAdmin(s);

    s.addOrEditPoolInternal(key, name, addresses, values);
    emit PoolUpdated(key, name, poolType, addresses[0], addresses[1], addresses[2], addresses[3], values[5], values[1], values[3], values[4], values[2]);
  }

  function validateAddOrEditPool(
    bytes32 key,
    string memory name,
    address[] memory addresses,
    uint256[] memory values
  ) external view override returns (bool) {
    return s.validateAddOrEditPoolInternal(key, name, addresses, values);
  }

  function closePool(bytes32 key) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeAdmin(s);

    s.setBoolByKeys(StakingPoolCoreLibV1.NS_POOL, key, false);

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
    return ProtoUtilV1.CNAME_BOND_POOL;
  }
}
