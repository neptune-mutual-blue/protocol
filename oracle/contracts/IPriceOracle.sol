// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.6.6;

interface IPriceOracle {
  function update() external;

  function consult(address token, uint256 amountIn) external view returns (uint256 amountOut);
}
