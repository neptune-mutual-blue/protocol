// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract FakeToken is ERC20 {
  constructor(
    string memory name,
    string memory symbol,
    uint256 supply
  ) ERC20(name, symbol) {
    super._mint(super._msgSender(), supply);
  }

  function mint(address account, uint256 amount) external {
    super._mint(account, amount);
  }

  function burn(uint256 amount) external {
    super._burn(super._msgSender(), amount);
  }
}
