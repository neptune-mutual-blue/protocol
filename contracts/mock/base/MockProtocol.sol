// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/access/AccessControl.sol";

// slither-disable-next-line missing-inheritance
contract MockProtocol is AccessControl {
  bool public state = false;

  function setPaused(bool s) external {
    state = s;
  }

  function paused() external view returns (bool) {
    return state;
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
