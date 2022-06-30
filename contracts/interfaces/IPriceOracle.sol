// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

interface IPriceOracle {
  function update() external;

  function consult(address token, uint256 amountIn) external view returns (uint256 amountOut);

  function consultPair(uint256 amountIn) external view returns (uint256);
}
