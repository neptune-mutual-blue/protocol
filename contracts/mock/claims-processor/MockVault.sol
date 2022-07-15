// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract MockVault is ERC20 {
  constructor() ERC20("USD Coin", "USDC") {
    super._mint(msg.sender, 100_000 ether);
  }

  function transferGovernance(
    bytes32,
    address sender,
    uint256 amount
  ) external {
    if (sender != address(0)) {
      super._mint(sender, amount);
    }
  }
}
