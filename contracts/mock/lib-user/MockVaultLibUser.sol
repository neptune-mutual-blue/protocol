// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/VaultLibV1.sol";
import "../../libraries/StrategyLibV1.sol";

contract MockVaultLibUser {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using StrategyLibV1 for IStore;
  using VaultLibV1 for IStore;

  IStore public s;

  constructor(IStore store) {
    s = store;
  }

  function setFlashLoanStatus(bytes32 coverKey, bool status) external {
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey, status);
  }

  function getFlashLoanStatus(bytes32 coverKey) external view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey);
  }

  function preAddLiquidityInternal(
    bytes32 coverKey,
    address pod,
    address account,
    uint256 amount,
    uint256 npmStakeToAdd
  ) external {
    s.preAddLiquidityInternal(coverKey, pod, account, amount, npmStakeToAdd);
  }

  function preRemoveLiquidityInternal(
    bytes32 coverKey,
    address pod,
    address account,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external returns (address stablecoin, uint256 releaseAmount) {
    (stablecoin, releaseAmount) = s.preRemoveLiquidityInternal(coverKey, pod, account, podsToRedeem, npmStakeToRemove, exit);
    require(releaseAmount == 0, "Release amount should be zero");
  }

  function setAmountInStrategies(
    bytes32 coverKey,
    address stablecoin,
    uint256 amount
  ) external {
    // getStrategyOutKey
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_STRATEGY_OUT, coverKey, stablecoin));

    s.setUintByKey(k, amount);
  }

  function mustHaveNoBalanceInStrategies(bytes32 coverKey, address stablecoin) external view {
    s.mustHaveNoBalanceInStrategies(coverKey, stablecoin);
  }

  function getMaxFlashLoanInternal(bytes32 coverKey, address token) external view returns (uint256) {
    return s.getMaxFlashLoanInternal(coverKey, token);
  }

  function setAddressByKey(bytes32 key, address value) external {
    s.setAddressByKey(key, value);
  }

  function getAddressByKey(bytes32 key) external view returns (address) {
    return s.getAddressByKey(key);
  }
}
