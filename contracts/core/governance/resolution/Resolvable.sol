/* solhint-disable function-max-lines */
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

  function resolve(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);
    s.mustBeReportingOrDisputed(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeAfterReportingPeriod(coverKey, productKey);
    s.mustNotHaveResolutionDeadline(coverKey, productKey);

    bool decision = s.getCoverProductStatus(coverKey, productKey) == CoverUtilV1.CoverStatus.IncidentHappened;

    _resolve(coverKey, productKey, incidentDate, decision, false);
  }

  function emergencyResolve(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    bool decision
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeAfterReportingPeriod(coverKey, productKey);
    s.mustBeBeforeResolutionDeadline(coverKey, productKey);

    _resolve(coverKey, productKey, incidentDate, decision, true);
  }

  function _resolve(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    bool decision,
    bool emergency
  ) private {
    // A grace period given to a governance admin(s) to defend
    // against a concensus attack(s).
    uint256 cooldownPeriod = s.getCoolDownPeriodInternal(coverKey);

    // The timestamp until when a governance admin is allowed
    // to perform emergency resolution.
    // After this timestamp, the cover has to be claimable
    // or finalized
    uint256 deadline = s.getResolutionDeadlineInternal(coverKey, productKey);

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
    s.setStatusInternal(coverKey, productKey, incidentDate, status);

    if (deadline == 0) {
      // Deadline can't be before claim begin date.
      // In other words, once a cover becomes claimable, emergency resolution
      // can not be performed any longer
      deadline = block.timestamp + cooldownPeriod; // solhint-disable-line
      s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_DEADLINE, coverKey, productKey, deadline);
    }

    // Claim begins when deadline timestamp is passed
    uint256 claimBeginsFrom = decision ? deadline + 1 : 0;

    // Claim expires after the period specified by the cover creator.
    uint256 claimExpiresAt = decision ? claimBeginsFrom + s.getClaimPeriod(coverKey) : 0;

    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, coverKey, productKey, claimBeginsFrom);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey, claimExpiresAt);

    s.updateStateAndLiquidity(coverKey);

    emit Resolved(coverKey, productKey, incidentDate, deadline, decision, emergency, claimBeginsFrom, claimExpiresAt);
  }

  function configureCoolDownPeriod(bytes32 coverKey, uint256 period) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);

    require(period > 0, "Please specify period");

    if (coverKey > 0) {
      s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, coverKey, period);
    } else {
      s.setUintByKey(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, period);
    }

    emit CooldownPeriodConfigured(coverKey, period);
  }

  function getCoolDownPeriod(bytes32 coverKey) external view override returns (uint256) {
    return s.getCoolDownPeriodInternal(coverKey);
  }

  function getResolutionDeadline(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getResolutionDeadlineInternal(coverKey, productKey);
  }
}
