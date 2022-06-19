// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../dependencies/uniswap-v2/IUniswapV2PairLike.sol";

contract FakeUniswapV2PairLike is IUniswapV2PairLike {
  address public override token0;
  address public override token1;

  constructor(address _token0, address _token1) {
    token0 = _token0;
    token1 = _token1;
  }

  function totalSupply() external pure override returns (uint256) {
    return 100 ether;
  }

  function getReserves()
    external
    view
    override
    returns (
      uint112 reserve0,
      uint112 reserve1,
      uint32 blockTimestampLast
    )
  {
    reserve0 = 200 ether;
    reserve1 = 100 ether;
    blockTimestampLast = uint32(block.timestamp); // solhint-disable-line
  }
}
