// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/access/AccessControl.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";
import "../libraries/ProtoUtilV1.sol";
import "./Recoverable.sol";

abstract contract ProtoBase is AccessControl, Pausable, Recoverable {
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;

  constructor(IStore store) Recoverable(store) {
    _setAccessPolicy();
  }

  function _setAccessPolicy() private {
    _setRoleAdmin(AccessControlLibV1.NS_ROLES_ADMIN, AccessControlLibV1.NS_ROLES_ADMIN);
    _setRoleAdmin(AccessControlLibV1.NS_ROLES_COVER_MANAGER, AccessControlLibV1.NS_ROLES_ADMIN);
    _setRoleAdmin(AccessControlLibV1.NS_ROLES_LIQUIDITY_MANAGER, AccessControlLibV1.NS_ROLES_ADMIN);
    _setRoleAdmin(AccessControlLibV1.NS_ROLES_GOVERNANCE_ADMIN, AccessControlLibV1.NS_ROLES_ADMIN);
    _setRoleAdmin(AccessControlLibV1.NS_ROLES_GOVERNANCE_AGENT, AccessControlLibV1.NS_ROLES_GOVERNANCE_ADMIN);
    _setRoleAdmin(AccessControlLibV1.NS_ROLES_UPGRADE_AGENT, AccessControlLibV1.NS_ROLES_ADMIN);
    _setRoleAdmin(AccessControlLibV1.NS_ROLES_RECOVERY_AGENT, AccessControlLibV1.NS_ROLES_ADMIN);
    _setRoleAdmin(AccessControlLibV1.NS_ROLES_PAUSE_AGENT, AccessControlLibV1.NS_ROLES_ADMIN);
    _setRoleAdmin(AccessControlLibV1.NS_ROLES_UNPAUSE_AGENT, AccessControlLibV1.NS_ROLES_ADMIN);

    _setupRole(AccessControlLibV1.NS_ROLES_ADMIN, msg.sender);
  }

  function setupRole(
    bytes32 role,
    bytes32 adminRole,
    address account
  ) external {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeAdmin(s);

    _setRoleAdmin(role, adminRole);

    if (account != address(0)) {
      _setupRole(role, account);
    }
  }

  /**
   * @dev Pauses this contract.
   * Can only be called by "Pause Agents".
   */
  function pause() external {
    AccessControlLibV1.mustBePauseAgent(s);
    super._pause();
  }

  /**
   * @dev Unpauses this contract.
   * Can only be called by "Unpause Agents".
   */
  function unpause() external whenPaused {
    AccessControlLibV1.mustBeUnpauseAgent(s);
    super._unpause();
  }
}
