// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract MockCxToken is ERC20 {
  constructor() ERC20("Test", "Test") {
    super._mint(msg.sender, 1 ether);
  }

  function burn(uint256 amount) external {
    super._burn(msg.sender, amount);
  }

  function expiresOn() external view returns (uint256) {
    return block.timestamp + 30 days; // solhint-disable-line
  }

  function COVER_KEY() external pure returns (bytes32) {
    return "test";
  }
}
