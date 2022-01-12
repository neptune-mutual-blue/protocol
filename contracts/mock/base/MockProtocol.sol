// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/access/AccessControl.sol";

contract MockProtocol is AccessControl {
  bool public _state = false;

  function setPaused(bool state) public {
    _state = state;
  }

  function paused() public view returns (bool) {
    return _state;
  }

  function setupRole(
    bytes32 role,
    bytes32 adminRole,
    address account
  ) external {
    _setRoleAdmin(role, adminRole);

    if (account != address(0)) {
      _setupRole(role, account);
    }
  }
}
