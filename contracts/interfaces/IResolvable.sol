// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

interface IResolvable {
  event Resolved(
    bytes32 indexed coverKey,
    bytes32 indexed productKey,
    uint256 incidentDate,
    uint256 resolutionDeadline,
    bool decision,
    bool emergency,
    uint256 claimBeginsFrom,
    uint256 claimExpiresAt
  );
  event CooldownPeriodConfigured(bytes32 indexed coverKey, uint256 period);
  event ReportClosed(bytes32 indexed coverKey, bytes32 indexed productKey, address indexed closedBy, uint256 incidentDate);

  function resolve(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external;

  function emergencyResolve(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    bool decision
  ) external;

  function closeReport(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external;

  function configureCoolDownPeriod(bytes32 coverKey, uint256 period) external;

  function getCoolDownPeriod(bytes32 coverKey) external view returns (uint256);

  function getResolutionDeadline(bytes32 coverKey, bytes32 productKey) external view returns (uint256);
}
