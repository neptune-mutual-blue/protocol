// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
// solhint-disable compiler-version
pragma solidity 0.6.6;

interface IPriceOracle {
  event PriceUpdated(address indexed updater, uint32 timeElapsed, uint256 price0Cumulative, uint256 price1Cumulative);

  function update() external;

  function consult(address token, uint256 amountIn) external view returns (uint256);

  function consultPair(uint256 amountIn) external view returns (uint256);
}
