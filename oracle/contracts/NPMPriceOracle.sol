// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.6;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/lib/contracts/libraries/FixedPoint.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2OracleLibrary.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";
import "./IPriceOracle.sol";

contract NPMPriceOracle is IPriceOracle {
  using FixedPoint for *;

  uint256 public constant UPDATE_INTERVAL = 5 minutes;

  address public immutable token0;
  address public immutable token1;
  IUniswapV2Pair public immutable pair;

  uint256 public price0CumulativeLast;
  uint256 public price1CumulativeLast;
  uint32 public blockTimestampLast;

  FixedPoint.uq112x112 public price0Average;
  FixedPoint.uq112x112 public price1Average;

  constructor(
    address factory,
    address tokenA,
    address tokenB
  ) public {
    IUniswapV2Pair _pair = IUniswapV2Pair(UniswapV2Library.pairFor(factory, tokenA, tokenB));
    (uint256 reserve0, uint256 reserve1, uint32 lastTimestamp) = _pair.getReserves();

    require(reserve0 != 0 && reserve1 != 0, "No reserve");

    token0 = _pair.token0();
    token1 = _pair.token1();
    pair = _pair;

    price0CumulativeLast = _pair.price0CumulativeLast();
    price1CumulativeLast = _pair.price1CumulativeLast();
    blockTimestampLast = lastTimestamp;
  }

  function update() external override {
    (uint256 price0Cumulative, uint256 price1Cumulative, uint32 blockTimestamp) = UniswapV2OracleLibrary.currentCumulativePrices(address(pair));
    uint32 timeElapsed = blockTimestamp - blockTimestampLast;

    if (timeElapsed < UPDATE_INTERVAL) {
      return;
    }

    price0Average = FixedPoint.uq112x112(uint224((price0Cumulative - price0CumulativeLast) / timeElapsed));
    price1Average = FixedPoint.uq112x112(uint224((price1Cumulative - price1CumulativeLast) / timeElapsed));

    price0CumulativeLast = price0Cumulative;
    price1CumulativeLast = price1Cumulative;
    blockTimestampLast = blockTimestamp;
  }

  function consult(address token, uint256 amountIn) external view override returns (uint256) {
    if (token == token0) {
      return price0Average.mul(amountIn).decode144();
    }

    require(token == token1, "Invalid token");
    return price1Average.mul(amountIn).decode144();
  }
}
