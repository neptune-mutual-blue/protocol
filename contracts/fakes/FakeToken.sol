// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract FakeToken is ERC20 {
  constructor(
    string memory name,
    string memory symbol,
    uint256 supply
  ) ERC20(name, symbol) {
    super._mint(msg.sender, supply);
  }

  function mint(address account, uint256 amount) external {
    super._mint(account, amount);
  }

  /**
   * @dev Request 100000 tokens
   */
  function request() external {
    super._mint(msg.sender, 100000 ether);
  }

  function burn(uint256 amount) external {
    super._burn(msg.sender, amount);
  }
}
