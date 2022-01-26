// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/external/IUniswapV2FactoryLike.sol";

contract FakeUniswapV2FactoryLike is IUniswapV2FactoryLike {
  address public pair;

  constructor(address _pair) {
    pair = _pair;
  }

  function getPair(address, address) external view override returns (address) {
    return pair;
  }
}
