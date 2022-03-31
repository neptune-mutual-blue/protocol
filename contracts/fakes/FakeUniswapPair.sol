// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/external/IUniswapV2PairLike.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract FakeUniswapPair is IUniswapV2PairLike, ERC20 {
  address public override token0;
  address public override token1;

  constructor(address _token0, address _token1) ERC20("PAIR", "PAIR") {
    token0 = _token0;
    token1 = _token1;

    super._mint(msg.sender, 100000 ether);
  }

  function totalSupply() public view override(ERC20, IUniswapV2PairLike) returns (uint256) {
    return super.totalSupply();
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
    reserve0 = 100000 ether;
    reserve1 = 50000 ether;
    blockTimestampLast = uint32(block.timestamp - 1 hours); // solhint-disable-line
  }
}
