// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./Finalization.sol";
import "../../../interfaces/IResolvable.sol";
import "../../../libraries/NTransferUtilV2.sol";

/**
 * @title Neptune Mutual Governance: Resolvable Contract
 * @dev Enables governance agents to resolve a contract undergoing reporting.
 * Provides a cool-down period of 24-hours during when governance admins
 * can perform emergency resolution to defend against governance attacks.
 */

abstract contract Resolvable is Finalization, IResolvable {
  using GovernanceUtilV1 for IStore;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using RoutineInvokerLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;
  using NTransferUtilV2 for IERC20;

  function resolve(bytes32 key, uint256 incidentDate) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);
    s.mustBeReportingOrDisputed(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeAfterReportingPeriod(key);

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
    s.mustBeAfterReportingPeriod(key);

    _resolve(key, incidentDate, decision, true);
  }

  function _resolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision,
    bool emergency
  ) private {
    CoverUtilV1.CoverStatus status = decision ? CoverUtilV1.CoverStatus.Claimable : CoverUtilV1.CoverStatus.FalseReporting;

    uint256 claimBeginsFrom = 0; // solhint-disable-line
    uint256 claimExpiresAt = 0;

    if (decision) {
      claimBeginsFrom = block.timestamp + 24 hours; // solhint-disable-line
      claimExpiresAt = claimBeginsFrom + s.getClaimPeriod();

      s.setUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, key, claimBeginsFrom);
      s.setUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key, claimExpiresAt);
    }

    s.setStatus(key, status);

    s.updateStateAndLiquidity(key);

    emit Resolved(key, incidentDate, decision, emergency, claimBeginsFrom, claimExpiresAt);
  }
}
