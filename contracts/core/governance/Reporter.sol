// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../interfaces/IReporter.sol";
import "./Witness.sol";

/**
 * @title Neptune Mutual Governance: Reporter Contract
 * @dev This contract enables any NPM tokenholder to
 * report an incident or dispute a reported incident.
 * <br />
 * The reporters can submit incidents and/or dispute them as well.
 * When a cover pool is reporting, other tokenholders can also join
 * the reporters achieve a resolution.

* The reporter who first submits an incident is known as `First Reporter` whereas
* the reporter who disputes the reported incident is called `Candidate Reporter`. 
 *
 */
abstract contract Reporter is IReporter, Witness {
  using GovernanceUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  function report(
    bytes32 coverKey,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible

    s.mustNotBePaused();
    s.mustHaveNormalCoverStatus(coverKey);

    uint256 incidentDate = block.timestamp; // solhint-disable-line
    require(stake > 0, "Stake insufficient");
    require(stake >= s.getMinReportingStakeInternal(coverKey), "Stake insufficient");

    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, incidentDate);

    // Set the Resolution Timestamp
    uint256 resolutionDate = block.timestamp + s.getReportingPeriodInternal(coverKey); // solhint-disable-line
    s.setUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, coverKey, resolutionDate);

    // Update the values
    s.addAttestationInternal(coverKey, msg.sender, incidentDate, stake);

    // Transfer the stake to the resolution contract
    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Reported(coverKey, msg.sender, incidentDate, info, stake, resolutionDate);
    emit Attested(coverKey, msg.sender, incidentDate, stake);
  }

  function dispute(
    bytes32 coverKey,
    uint256 incidentDate,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible

    s.mustNotBePaused();
    s.mustNotHaveDispute(coverKey);
    s.mustBeReporting(coverKey);
    s.mustBeValidIncidentDate(coverKey, incidentDate);
    s.mustBeDuringReportingPeriod(coverKey);

    require(stake > 0, "Stake insufficient");
    require(stake >= s.getMinReportingStakeInternal(coverKey), "Stake insufficient");

    s.addDisputeInternal(coverKey, msg.sender, incidentDate, stake);

    // Transfer the stake to the resolution contract
    s.npmToken().ensureTransferFrom(msg.sender, address(s.getResolutionContract()), stake);

    emit Disputed(coverKey, msg.sender, incidentDate, info, stake);
    emit Refuted(coverKey, msg.sender, incidentDate, stake);
  }

  function setFirstReportingStake(uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    require(value > 0, "Please specify value");

    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, value);

    emit FirstReportingStakeSet(previous, value);
  }

  function getFirstReportingStake() external view override returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE);
  }

  function getFirstReportingStake(bytes32 coverKey) external view override returns (uint256) {
    return s.getMinReportingStakeInternal(coverKey);
  }

  function setReportingBurnRate(uint256 value) external override nonReentrant {
    require(value > 0, "Please specify value");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTING_BURN_RATE, value);

    emit ReportingBurnRateSet(previous, value);
  }

  function setReporterCommission(uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    require(value > 0, "Please specify value");

    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION);
    s.setUintByKey(ProtoUtilV1.NS_GOVERNANCE_REPORTER_COMMISSION, value);

    emit ReporterCommissionSet(previous, value);
  }

  function getActiveIncidentDate(bytes32 coverKey) external view override returns (uint256) {
    return s.getActiveIncidentDateInternal(coverKey);
  }

  function getReporter(bytes32 coverKey, uint256 incidentDate) external view override returns (address) {
    return s.getReporterInternal(coverKey, incidentDate);
  }

  function getResolutionTimestamp(bytes32 coverKey) external view override returns (uint256) {
    return s.getResolutionTimestampInternal(coverKey);
  }

  function getAttestation(
    bytes32 coverKey,
    address who,
    uint256 incidentDate
  ) external view override returns (uint256 myStake, uint256 totalStake) {
    return s.getAttestationInternal(coverKey, who, incidentDate);
  }

  function getDispute(
    bytes32 coverKey,
    address who,
    uint256 incidentDate
  ) external view override returns (uint256 myStake, uint256 totalStake) {
    return s.getDisputeInternal(coverKey, who, incidentDate);
  }
}
