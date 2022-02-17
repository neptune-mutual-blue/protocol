// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

interface IResolvable {
  event Resolved(bytes32 key, uint256 incidentDate, uint256 resolutionDeadline, bool decision, bool emergency, uint256 claimBeginsFrom, uint256 claimExpiresAt);
  event CooldownPeriodConfigured(bytes32 key, uint256 period);

  function resolve(bytes32 key, uint256 incidentDate) external;

  function emergencyResolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision
  ) external;

  function configureCoolDownPeriod(bytes32 key, uint256 period) external;

  function getCoolDownPeriod(bytes32 key) external view returns (uint256);

  function getResolutionDeadline(bytes32 key) external view returns (uint256);
}
