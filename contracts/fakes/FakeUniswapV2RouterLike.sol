// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/external/IUniswapV2RouterLike.sol";

contract FakeUniswapV2RouterLike is IUniswapV2RouterLike {
  function getAmountsOut(uint256 multiplier, address[] calldata) external pure override returns (uint256[] memory) {
    uint256[] memory amounts = new uint256[](2);

    amounts[0] = multiplier;
    amounts[1] = multiplier;

    return amounts;
  }
}
