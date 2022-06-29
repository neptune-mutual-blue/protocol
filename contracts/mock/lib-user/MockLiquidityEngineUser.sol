// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/StrategyLibV1.sol";

contract MockLiquidityEngineUser {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using StrategyLibV1 for IStore;
  using CoverUtilV1 for IStore;

  IStore public s;

  constructor(IStore store) {
    s = store;
  }

  function setMaxLendingRatioInternal(uint256 ratio) external {
    s.setMaxLendingRatioInternal(ratio);
  }
}
