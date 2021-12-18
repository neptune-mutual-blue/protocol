// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../Recoverable.sol";
import "../../../interfaces/IFinalization.sol";
import "../../../libraries/GovernanceUtilV1.sol";
import "../../../libraries/ValidationLibV1.sol";

abstract contract Finalization is IFinalization, Recoverable {
  using GovernanceUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;

  function finalize(bytes32 key, uint256 incidentDate) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);

    s.mustBeClaimingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeAfterClaimExpiry(key);

    _finalize(key, incidentDate);
  }

  function _finalize(bytes32 key, uint256 incidentDate) internal {
    // Reset to normal
    s.setStatus(key, CoverUtilV1.CoverStatus.Normal);
    s.deleteUintByKeys(ProtoUtilV1.NS_REPORTING_INCIDENT_DATE, key);
    s.deleteUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key);
    s.deleteUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key);

    s.deleteAddressByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_YES, key);
    s.deleteUintByKeys(ProtoUtilV1.NS_REPORTING_WITNESS_YES, key);

    emit Finalized(key, msg.sender, incidentDate);
  }
}
