// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./Governance.sol";
import "../../interfaces/IGovernance.sol";
import "../../interfaces/ICToken.sol";

contract Resolution is IGovernance, Governance {
  using GovernanceUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;

  constructor(IStore store) Recoverable(store) {
    this;
  }

  function resolve(bytes32 key, uint256 incidentDate) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);

    bool decision = s.getCoverStatus(key) == CoverUtilV1.CoverStatus.IncidentHappened;

    _resolve(key, incidentDate, decision, false);
  }

  function emergencyResolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision
  ) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);
    s.mustBeValidIncidentDate(key, incidentDate);

    _resolve(key, incidentDate, decision, true);
  }

  function _resolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision,
    bool emergency
  ) private {
    if (decision == false) {
      super._finalize(key, incidentDate);
      return;
    }

    uint256 claimBeginsFrom = block.timestamp + 24 hours; // solhint-disable-line
    uint256 claimExpiresAt = claimBeginsFrom + s.getClaimPeriod();

    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, key, claimBeginsFrom);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key, claimExpiresAt);

    s.setStatus(key, CoverUtilV1.CoverStatus.Claimable);

    emit Resolved(key, incidentDate, decision, emergency);
  }
}
