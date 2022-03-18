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
    s.mustNotHaveResolutionDeadline(key);

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
    s.mustBeBeforeResolutionDeadline(key);

    _resolve(key, incidentDate, decision, true);
  }

  function _resolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision,
    bool emergency
  ) private {
    // A grace period given to a governance admin(s) to defend
    // against a concensus attack(s).
    uint256 cooldownPeriod = s.getCoolDownPeriodInternal(key);

    // The timestamp until when a governance admin is allowed
    // to perform emergency resolution.
    // After this timestamp, the cover has to be claimable
    // or finalized
    uint256 deadline = s.getResolutionDeadlineInternal(key);

    // A cover, when being resolved, will either directly go to finalization or have a claim period.
    //
    // Decision: False Reporting
    // 1. A governance admin can still overwrite, override, or reverse this decision before `deadline`.
    // 2. After the deadline and before finalization, the NPM holders
    //    who staked for `False Reporting` camp can withdraw the original stake + reward.
    // 3. After finalization, the NPM holders who staked for this camp will only be able to receive
    // back the original stake. No rewards.
    //
    // Decision: Claimable
    //
    // 1. A governance admin can still overwrite, override, or reverse this decision before `deadline`.
    // 2. All policyholders must claim during the `Claim Period`. Otherwise, claims are not valid.
    // 3. After the deadline and before finalization, the NPM holders
    //    who staked for `Incident Happened` camp can withdraw the original stake + reward.
    // 4. After finalization, the NPM holders who staked for this camp will only be able to receive
    // back the original stake. No rewards.
    CoverUtilV1.CoverStatus status = decision ? CoverUtilV1.CoverStatus.Claimable : CoverUtilV1.CoverStatus.FalseReporting;

    // Status can change during `Emergency Resolution` attempt(s)
    s.setStatus(key, status);

    if (deadline == 0) {
      // Deadline can't be before claim begin date.
      // In other words, once a cover becomes claimable, emergency resolution
      // can not be performed any longer
      deadline = block.timestamp + cooldownPeriod; // solhint-disable-line
      s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_DEADLINE, key, deadline);
    }

    // Claim begins when deadline timestamp is passed
    uint256 claimBeginsFrom = decision ? deadline : 0;

    // Claim expires after the period specified by the cover creator.
    uint256 claimExpiresAt = decision ? claimBeginsFrom + s.getClaimPeriod(key) : 0;

    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, key, claimBeginsFrom);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key, claimExpiresAt);

    s.updateStateAndLiquidity(key);

    emit Resolved(key, incidentDate, deadline, decision, emergency, claimBeginsFrom, claimExpiresAt);
  }

  function configureCoolDownPeriod(bytes32 key, uint256 period) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);
    s.mustHaveNormalCoverStatus(key);

    if (key > 0) {
      s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, key, period);
    } else {
      s.setUintByKey(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, period);
    }

    emit CooldownPeriodConfigured(key, period);
  }

  function getCoolDownPeriod(bytes32 key) external view override returns (uint256) {
    return s.getCoolDownPeriodInternal(key);
  }

  function getResolutionDeadline(bytes32 key) external view override returns (uint256) {
    return s.getResolutionDeadlineInternal(key);
  }
}
