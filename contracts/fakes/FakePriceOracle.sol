// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/IPriceOracle.sol";

contract FakePriceOracle is IPriceOracle {
  uint256 private _counter = 0;

  function update() external override {
    _counter++;
  }

  function consult(address, uint256 amountIn) external pure override returns (uint256) {
    return amountIn * 2;
  }

  function consultPair(uint256 amountIn) external pure override returns (uint256) {
    return amountIn;
  }
}
