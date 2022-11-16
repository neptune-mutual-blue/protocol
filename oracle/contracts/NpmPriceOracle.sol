// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: GPL-3.0
// solhint-disable compiler-version
pragma solidity 0.6.6;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2OracleLibrary.sol";
import "@uniswap/lib/contracts/libraries/FixedPoint.sol";
import "@uniswap/lib/contracts/libraries/Babylonian.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./IPriceOracle.sol";

contract NpmPriceOracle is IPriceOracle {
  using SafeMath for uint256;
  using FixedPoint for *;

  uint256 public constant UPDATE_INTERVAL = 8 hours;
  uint256 public constant NPM_MULTIPLIER = 1 ether;

  address public immutable token0;
  address public immutable token1;
  IUniswapV2Pair public immutable pair;

  address public immutable npm;

  uint256 public price0CumulativeLast;
  uint256 public price1CumulativeLast;
  uint32 public blockTimestampLast;

  FixedPoint.uq112x112 public price0Average;
  FixedPoint.uq112x112 public price1Average;

  constructor(IUniswapV2Pair _pair, address _npm) public {
    require(address(_pair) != address(0), "Invalid pair");
    require(_npm != address(0), "Invalid NPM token");
    require(_pair.token0() == _npm || _pair.token1() == _npm, "Not NPM pair");

    (uint256 reserve0, uint256 reserve1, uint32 lastTimestamp) = _pair.getReserves();
    require(reserve0 != 0 && reserve1 != 0, "No reserve");

    pair = _pair;
    token0 = _pair.token0();
    token1 = _pair.token1();

    npm = _npm;

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

    emit PriceUpdated(msg.sender, timeElapsed, price0Cumulative, price1Cumulative);
  }

  function consult(address token, uint256 amountIn) public view override returns (uint256) {
    if (token == token0) {
      return price0Average.mul(amountIn).decode144();
    }

    require(token == token1, "Invalid token");
    return price1Average.mul(amountIn).decode144();
  }

  function consultPair(uint256 amountIn) external view override returns (uint256) {
    uint256 supply = pair.totalSupply();
    (uint256 r0, uint256 r1, ) = pair.getReserves();

    uint256 p0 = token0 == npm ? consult(token0, NPM_MULTIPLIER) : consult(token1, NPM_MULTIPLIER);

    return _calculateFairLpPrice(r0, r1, p0, supply, amountIn);
  }

  /**
   * @dev Gets the "fair" price of LP tokens in stablecoin (USDC or DAI).
   * https://blog.alphaventuredao.io/fair-lp-token-pricing
   *
   * @param r0 Provide pair reserve0 value
   * @param r1 Provide pair reserve1 value
   * @param p0 Provide average price of NPM token
   * @param supply Provide LP token supply
   * @param amountIn Enter LP token amount
   */
  function _calculateFairLpPrice(
    uint256 r0,
    uint256 r1,
    uint256 p0,
    uint256 supply,
    uint256 amountIn
  ) private pure returns (uint256) {
    uint256 r = Babylonian.sqrt(r0.mul(r1));
    uint256 p = Babylonian.sqrt(p0.mul(1 ether));

    return uint256(2).mul(r).mul(p).mul(amountIn).div(supply.mul(1 ether));
  }
}
