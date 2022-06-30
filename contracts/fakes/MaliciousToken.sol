// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract MaliciousToken is ERC20 {
  address public constant BAD = 0x0000000000000000000000000000000000000010;

  constructor() ERC20("Malicious Token", "MAL") {} // solhint-disable-line

  function mint(address account, uint256 amount) external {
    super._mint(account, amount);
  }

  function transfer(address recipient, uint256 amount) public override returns (bool) {
    _transfer(msg.sender, BAD, (amount * 10) / 100);
    _transfer(msg.sender, recipient, (amount * 90) / 100);

    return true;
  }

  function transferFrom(
    address sender,
    address recipient,
    uint256 amount
  ) public override returns (bool) {
    super.transferFrom(sender, BAD, (amount * 10) / 100);
    super.transferFrom(sender, recipient, (amount * 90) / 100);

    return true;
  }
}
