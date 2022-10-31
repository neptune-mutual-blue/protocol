// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/access/IAccessControl.sol";
import "./ProtoUtilV1.sol";

library AccessControlLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  bytes32 public constant NS_ROLES_ADMIN = 0x00; // SAME AS "DEFAULT_ADMIN_ROLE"
  bytes32 public constant NS_ROLES_COVER_MANAGER = "role:cover:manager";
  bytes32 public constant NS_ROLES_LIQUIDITY_MANAGER = "role:liquidity:manager";
  bytes32 public constant NS_ROLES_GOVERNANCE_AGENT = "role:governance:agent";
  bytes32 public constant NS_ROLES_GOVERNANCE_ADMIN = "role:governance:admin";
  bytes32 public constant NS_ROLES_UPGRADE_AGENT = "role:upgrade:agent";
  bytes32 public constant NS_ROLES_RECOVERY_AGENT = "role:recovery:agent";
  bytes32 public constant NS_ROLES_PAUSE_AGENT = "role:pause:agent";
  bytes32 public constant NS_ROLES_UNPAUSE_AGENT = "role:unpause:agent";

  /**
   * @dev Reverts if the sender is not the protocol admin.
   */
  function mustBeAdmin(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_ADMIN, msg.sender);
  }

  /**
   * @dev Reverts if the sender is not the cover manager.
   */
  function mustBeCoverManager(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_COVER_MANAGER, msg.sender);
  }

  /**
   * @dev Reverts if the sender is not the liquidity manager.
   */
  function mustBeLiquidityManager(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_LIQUIDITY_MANAGER, msg.sender);
  }

  /**
   * @dev Reverts if the sender is not a governance agent.
   */
  function mustBeGovernanceAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_GOVERNANCE_AGENT, msg.sender);
  }

  /**
   * @dev Reverts if the sender is not a governance admin.
   */
  function mustBeGovernanceAdmin(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_GOVERNANCE_ADMIN, msg.sender);
  }

  /**
   * @dev Reverts if the sender is not an upgrade agent.
   */
  function mustBeUpgradeAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_UPGRADE_AGENT, msg.sender);
  }

  /**
   * @dev Reverts if the sender is not a recovery agent.
   */
  function mustBeRecoveryAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_RECOVERY_AGENT, msg.sender);
  }

  /**
   * @dev Reverts if the sender is not the pause agent.
   */
  function mustBePauseAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_PAUSE_AGENT, msg.sender);
  }

  /**
   * @dev Reverts if the sender is not the unpause agent.
   */
  function mustBeUnpauseAgent(IStore s) external view {
    _mustHaveAccess(s, NS_ROLES_UNPAUSE_AGENT, msg.sender);
  }

  /**
   * @dev Reverts if the caller is not the protocol admin.
   */
  function callerMustBeAdmin(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_ADMIN, caller);
  }

  /**
   * @dev Reverts if the caller is not the cover manager.
   */
  function callerMustBeCoverManager(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_COVER_MANAGER, caller);
  }

  /**
   * @dev Reverts if the caller is not the liquidity manager.
   */
  function callerMustBeLiquidityManager(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_LIQUIDITY_MANAGER, caller);
  }

  /**
   * @dev Reverts if the caller is not a governance agent.
   */
  function callerMustBeGovernanceAgent(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_GOVERNANCE_AGENT, caller);
  }

  /**
   * @dev Reverts if the caller is not a governance admin.
   */
  function callerMustBeGovernanceAdmin(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_GOVERNANCE_ADMIN, caller);
  }

  /**
   * @dev Reverts if the caller is not an upgrade agent.
   */
  function callerMustBeUpgradeAgent(IStore s, address caller) public view {
    _mustHaveAccess(s, NS_ROLES_UPGRADE_AGENT, caller);
  }

  /**
   * @dev Reverts if the caller is not a recovery agent.
   */
  function callerMustBeRecoveryAgent(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_RECOVERY_AGENT, caller);
  }

  /**
   * @dev Reverts if the caller is not the pause agent.
   */
  function callerMustBePauseAgent(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_PAUSE_AGENT, caller);
  }

  /**
   * @dev Reverts if the caller is not the unpause agent.
   */
  function callerMustBeUnpauseAgent(IStore s, address caller) external view {
    _mustHaveAccess(s, NS_ROLES_UNPAUSE_AGENT, caller);
  }

  /**
   * @dev Reverts if the caller does not have access to the given role.
   */
  function _mustHaveAccess(
    IStore s,
    bytes32 role,
    address caller
  ) private view {
    require(hasAccessInternal(s, role, caller), "Forbidden");
  }

  /**
   * @dev Checks if a given user has access to the given role
   * @param role Specify the role name
   * @param user Enter the user account
   * @return Returns true if the user is a member of the specified role
   */
  function hasAccessInternal(
    IStore s,
    bytes32 role,
    address user
  ) public view returns (bool) {
    address protocol = s.getProtocolAddressInternal();

    // The protocol is not deployed yet. Therefore, no role to check
    if (protocol == address(0)) {
      return false;
    }

    // You must have the same role in the protocol contract if you're don't have this role here
    return IAccessControl(protocol).hasRole(role, user);
  }

  /**
   * @dev Adds a protocol member contract
   *
   * @custom:suppress-address-trust-issue This feature can only be accessed internally within the protocol.
   *
   * @param s Enter the store instance
   * @param namespace Enter the contract namespace
   * @param key Enter the contract key
   * @param contractAddress Enter the contract address
   */
  function addContractInternal(
    IStore s,
    bytes32 namespace,
    bytes32 key,
    address contractAddress
  ) external {
    // Not only the msg.sender needs to be an upgrade agent
    // but the contract using this library (and this function)
    // must also be an upgrade agent
    callerMustBeUpgradeAgent(s, address(this));
    _addContract(s, namespace, key, contractAddress);
  }

  function _addContract(
    IStore s,
    bytes32 namespace,
    bytes32 key,
    address contractAddress
  ) private {
    if (key > 0) {
      s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace, key, contractAddress);
    } else {
      s.setAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace, contractAddress);
    }
    _addMember(s, contractAddress);
  }

  function _deleteContract(
    IStore s,
    bytes32 namespace,
    bytes32 key,
    address contractAddress
  ) private {
    if (key > 0) {
      s.deleteAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace, key);
    } else {
      s.deleteAddressByKeys(ProtoUtilV1.NS_CONTRACTS, namespace);
    }
    _removeMember(s, contractAddress);
  }

  /**
   * @dev Upgrades a contract at the given namespace and key.
   *
   * The previous contract's protocol membership is revoked and
   * the current immediately starts assuming responsibility of
   * whatever the contract needs to do at the supplied namespace and key.
   *
   * @custom:warning Warning:
   *
   * This feature is only accessible to an upgrade agent.
   * Since adding member to the protocol is a highly risky activity,
   * the role `Upgrade Agent` is considered to be one of the most `Critical` roles.
   *
   * @custom:suppress-address-trust-issue This feature can only be accessed internally within the protocol.
   *
   * @param s Provide store instance
   * @param namespace Enter a unique namespace for this contract
   * @param key Enter a key if this contract has siblings
   * @param previous Enter the existing contract address at this namespace and key.
   * @param current Enter the contract address which will replace the previous contract.
   */
  function upgradeContractInternal(
    IStore s,
    bytes32 namespace,
    bytes32 key,
    address previous,
    address current
  ) external {
    // Not only the msg.sender needs to be an upgrade agent
    // but the contract using this library (and this function)
    // must also be an upgrade agent
    callerMustBeUpgradeAgent(s, address(this));

    bool isMember = s.isProtocolMemberInternal(previous);
    require(isMember, "Not a protocol member");

    _deleteContract(s, namespace, key, previous);
    _addContract(s, namespace, key, current);
  }

  /**
   * @dev Adds member to the protocol
   *
   * A member is a trusted EOA or a contract that was added to the protocol using `addContract`
   * function. When a contract is removed using `upgradeContract` function, the membership of previous
   * contract is also removed.
   *
   * @custom:warning Warning:
   *
   * This feature is only accessible to an upgrade agent.
   * Since adding member to the protocol is a highly risky activity,
   * the role `Upgrade Agent` is considered to be one of the most `Critical` roles.
   *
   * @custom:suppress-address-trust-issue This feature can only be accessed internally within the protocol.
   *
   * @param member Enter an address to add as a protocol member
   */
  function addMemberInternal(IStore s, address member) external {
    // Not only the msg.sender needs to be an upgrade agent
    // but the contract using this library (and this function)
    // must also be an upgrade agent
    callerMustBeUpgradeAgent(s, address(this));

    _addMember(s, member);
  }

  /**
   * @dev Removes a member from the protocol. This function is only accessible
   * to an upgrade agent.
   *
   * @custom:suppress-address-trust-issue This feature can only be accessed internally within the protocol.
   *
   * @param member Enter an address to remove as a protocol member
   */
  function removeMemberInternal(IStore s, address member) external {
    // Not only the msg.sender needs to be an upgrade agent
    // but the contract using this library (and this function)
    // must also be an upgrade agent
    callerMustBeUpgradeAgent(s, address(this));

    _removeMember(s, member);
  }

  function _addMember(IStore s, address member) private {
    require(s.getBoolByKeys(ProtoUtilV1.NS_MEMBERS, member) == false, "Already exists");
    s.setBoolByKeys(ProtoUtilV1.NS_MEMBERS, member, true);
  }

  function _removeMember(IStore s, address member) private {
    s.deleteBoolByKeys(ProtoUtilV1.NS_MEMBERS, member);
  }
}
