// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IReporter.sol";
import "./Witness.sol";

abstract contract Reporter is IReporter, Witness {
  using GovernanceUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  function report(
    bytes32 key,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCover(key);

    uint256 incidentDate = block.timestamp; // solhint-disable-line
    uint256 minStake = s.getMinReportingStake();
    require(stake >= minStake, "Stake insufficient");

    s.setUintByKeys(ProtoUtilV1.NS_REPORTING_INCIDENT_DATE, key, incidentDate);

    // Set the Resolution Timestamp
    uint256 resolutionDate = block.timestamp + s.getReportingPeriod(key); // solhint-disable-line
    s.setUintByKeys(ProtoUtilV1.NS_RESOLUTION_TS, key, resolutionDate);

    // Set the claim expiry timestamp
    uint256 claimExpiry = resolutionDate + s.getClaimPeriod(key);
    s.setUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key, claimExpiry);

    // Update the values
    s.addAttestation(key, super._msgSender(), incidentDate, stake);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), stake);

    emit Reported(key, super._msgSender(), incidentDate, info, stake);
    emit Attested(key, super._msgSender(), incidentDate, stake);
  }

  function dispute(
    bytes32 key,
    uint256 incidentDate,
    bytes32 info,
    uint256 stake
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeReporting(key);
    s.mustBeValidIncidentDate(key, incidentDate);
    s.mustBeDuringReportingPeriod(key);

    uint256 minStake = s.getMinReportingStake();
    require(stake >= minStake, "Stake insufficient");

    s.addDispute(key, super._msgSender(), incidentDate, stake);

    s.nepToken().ensureTransferFrom(super._msgSender(), address(this), stake);

    emit Disputed(key, super._msgSender(), incidentDate, info, stake);
    emit Refuted(key, super._msgSender(), incidentDate, stake);
  }

  function getActiveIncidentDate(bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_REPORTING_INCIDENT_DATE, key);
  }

  function getReporter(bytes32 key, uint256 incidentDate) external view returns (address) {
    return s.getReporter(key, incidentDate);
  }
}
