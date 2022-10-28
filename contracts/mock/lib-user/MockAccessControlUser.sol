// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../../libraries/AccessControlLibV1.sol";
import "../../libraries/ProtoUtilV1.sol";

contract MockAccessControlUser {
  using AccessControlLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  IStore public s;

  constructor(IStore store) {
    s = store;
  }

  function callerMustBeAdmin(address caller) external view {
    s.callerMustBeAdmin(caller);
  }

  function callerMustBeCoverManager(address caller) external view {
    s.callerMustBeCoverManager(caller);
  }

  function callerMustBeGovernanceAgent(address caller) external view {
    s.callerMustBeGovernanceAgent(caller);
  }

  function callerMustBeGovernanceAdmin(address caller) external view {
    s.callerMustBeGovernanceAdmin(caller);
  }

  function callerMustBeRecoveryAgent(address caller) external view {
    s.callerMustBeRecoveryAgent(caller);
  }

  function callerMustBePauseAgent(address caller) external view {
    s.callerMustBePauseAgent(caller);
  }

  function callerMustBeUnpauseAgent(address caller) external view {
    s.callerMustBeUnpauseAgent(caller);
  }

  function hasAccess(bytes32 role, address user) external view returns (bool) {
    return s.hasAccessInternal(role, user);
  }
}
