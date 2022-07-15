// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "../core/liquidity/strategies/AaveStrategy.sol";

contract InvalidStrategy is AaveStrategy {
  constructor(
    IStore _s,
    IAaveV2LendingPoolLike _lendingPool,
    address _aToken
  ) AaveStrategy(_s, _lendingPool, _aToken) {} // solhint-disable-line

  function getWeight() external pure override returns (uint256) {
    return 20_000; // 100%
  }
}
