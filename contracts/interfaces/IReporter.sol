// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

interface IReporter {
  event Reported(bytes32 indexed coverKey, bytes32 indexed productKey, address reporter, uint256 indexed incidentDate, string info, uint256 initialStake, uint256 resolutionTimestamp);
  event Disputed(bytes32 indexed coverKey, bytes32 indexed productKey, address reporter, uint256 indexed incidentDate, string info, uint256 initialStake);

  event ReportingBurnRateSet(uint256 previous, uint256 current);
  event FirstReportingStakeSet(bytes32 coverKey, uint256 previous, uint256 current);
  event ReporterCommissionSet(uint256 previous, uint256 current);

  function report(
    bytes32 coverKey,
    bytes32 productKey,
    string calldata info,
    uint256 stake
  ) external;

  function dispute(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    string calldata info,
    uint256 stake
  ) external;

  function getActiveIncidentDate(bytes32 coverKey, bytes32 productKey) external view returns (uint256);

  function getAttestation(
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake);

  function getRefutation(
    bytes32 coverKey,
    bytes32 productKey,
    address who,
    uint256 incidentDate
  ) external view returns (uint256 myStake, uint256 totalStake);

  function getReporter(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (address);

  function getResolutionTimestamp(bytes32 coverKey, bytes32 productKey) external view returns (uint256);

  function setFirstReportingStake(bytes32 coverKey, uint256 value) external;

  function getFirstReportingStake(bytes32 coverKey) external view returns (uint256);

  function setReportingBurnRate(uint256 value) external;

  function setReporterCommission(uint256 value) external;
}
