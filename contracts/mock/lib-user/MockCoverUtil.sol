// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/StrategyLibV1.sol";

contract MockCoverUtilUser {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using StrategyLibV1 for IStore;
  using CoverUtilV1 for IStore;

  IStore public s;

  constructor(IStore store) {
    s = store;
  }

  function getActiveLiquidityUnderProtection(bytes32 coverKey, bytes32 productKey) external view returns (uint256) {
    uint256 precision = 10**IERC20Detailed(s.getStablecoin()).decimals();
    return s.getActiveLiquidityUnderProtection(coverKey, productKey, precision);
  }
}
