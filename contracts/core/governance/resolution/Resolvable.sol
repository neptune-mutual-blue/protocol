/* solhint-disable function-max-lines */
// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./Finalization.sol";
import "../../../interfaces/IResolvable.sol";
import "../../../libraries/NTransferUtilV2.sol";

/**
 * @title Resolvable Contract
 * @dev Enables governance agents to resolve a contract undergoing reporting.
 * Has a cool-down period of 24-hours (or as overridden) during when governance admins
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

  /**
   * @dev Marks as a cover as "resolved" after the reporting period.
   * A resolution has a (configurable) 24-hour cooldown period
   * that enables governance admins to revese decision in case of
   * attack or mistake.
   *
   * @custom:note Please note the following:
   *
   * An incident can be resolved:
   *
   * - by a governance agent
   * - if it was reported
   * - after the reporting period
   * - if it wasn't resolved earlier
   *
   * @param coverKey Enter the cover key you want to resolve
   * @param productKey Enter the product key you want to resolve
   * @param incidentDate Enter the date of this incident reporting
   */
  function resolve(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);

    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeReportingOrDisputed(coverKey, productKey);
    s.mustBeAfterReportingPeriod(coverKey, productKey);
    s.mustNotHaveResolutionDeadline(coverKey, productKey);

    bool decision = s.getProductStatusOfInternal(coverKey, productKey, incidentDate) == CoverUtilV1.ProductStatus.IncidentHappened;

    _resolve(coverKey, productKey, incidentDate, decision, false);
  }

  /**
   * @dev Enables governance admins to perform emergency resolution.
   *
   * @custom:note Please note the following:
   *
   * An incident can undergo an emergency resolution:
   *
   * - by a governance admin
   * - if it was reported
   * - after the reporting period
   * - before the resolution deadline
   *
   * @param coverKey Enter the cover key on which you want to perform emergency resolve
   * @param productKey Enter the product key on which you want to perform emergency resolve
   * @param incidentDate Enter the date of this incident reporting
   */
  function emergencyResolve(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    bool decision
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
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
    CoverUtilV1.ProductStatus status = decision ? CoverUtilV1.ProductStatus.Claimable : CoverUtilV1.ProductStatus.FalseReporting;

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

  /**
   * @dev Allows a governance admin to add or update resolution cooldown period for a given cover.
   *
   * @param coverKey Provide a coverKey or leave it empty. If empty, the cooldown period is set as
   * fallback value. Covers that do not have customized cooldown period will infer to the fallback value.
   * @param period Enter the cooldown period duration
   */
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

  /**
   * @dev Enables governance admins to perform a emergency resolution to close a report.
   * The status is set to `False Reporting` and the cover is made available to be finalized
   *
   * @custom:note Please note the following:
   *
   * An incident report can be closed:
   *
   * - by a governance admin
   * - during the reporting period
   * - if it was a false reporting
   *
   * @param coverKey Enter the cover key you want to resolve
   * @param productKey Enter the product key you want to resolve
   * @param incidentDate Enter the date of this incident reporting
   */
  function closeReport(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAdmin(s);

    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeDuringReportingPeriod(coverKey, productKey);
    s.mustNotHaveResolutionDeadline(coverKey, productKey);

    // solhint-disable-next-line not-rely-on-time
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, coverKey, productKey, block.timestamp);

    // solhint-disable-next-line not-rely-on-time
    s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_DEADLINE, coverKey, productKey, block.timestamp);

    _resolve(coverKey, productKey, incidentDate, false, true);
    _finalize(coverKey, productKey, incidentDate);

    emit ReportClosed(coverKey, productKey, msg.sender, incidentDate);
  }

  /**
   * @dev Gets the cooldown period of a given cover
   *
   * Warning: this function does not validate the cover key supplied.
   *
   */
  function getCoolDownPeriod(bytes32 coverKey) external view override returns (uint256) {
    return s.getCoolDownPeriodInternal(coverKey);
  }

  /**
   * @dev Gets the resolution deadline of a given cover product
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   */
  function getResolutionDeadline(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getResolutionDeadlineInternal(coverKey, productKey);
  }
}
