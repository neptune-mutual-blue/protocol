// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

interface IResolvable {
  event Resolved(bytes32 key, uint256 incidentDate, bool decision, bool emergency);

  function resolve(bytes32 key, uint256 incidentDate) external;

  function emergencyResolve(
    bytes32 key,
    uint256 incidentDate,
    bool decision
  ) external;
}
