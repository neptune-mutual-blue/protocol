// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/external/IUniswapV2RouterLike.sol";

contract FakeUniswapV2RouterLike is IUniswapV2RouterLike {
  address public tokenA;
  address public tokenB;

  function getAmountsOut(uint256 multiplier, address[] calldata) external pure override returns (uint256[] memory) {
    uint256[] memory amounts = new uint256[](2);

    amounts[0] = multiplier;
    amounts[1] = multiplier;

    return amounts;
  }

  function addLiquidity(
    address _tokenA,
    address _tokenB,
    uint256 _amountADesired,
    uint256 _amountBDesired,
    uint256,
    uint256,
    address,
    uint256
  )
    external
    override
    returns (
      uint256 amountA,
      uint256 amountB,
      uint256 liquidity
    )
  {
    tokenA = _tokenA;
    tokenB = _tokenB;

    amountA = _amountADesired;
    amountB = _amountBDesired;
    liquidity = 1;
  }
}
