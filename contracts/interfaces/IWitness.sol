// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

interface IWitness {
  event Attested(bytes32 indexed coverKey, bytes32 indexed productKey, address witness, uint256 indexed incidentDate, uint256 stake);
  event Refuted(bytes32 indexed coverKey, bytes32 indexed productKey, address witness, uint256 indexed incidentDate, uint256 stake);

  function attest(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 stake
  ) external;

  function refute(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 stake
  ) external;

  function getStatus(bytes32 coverKey, bytes32 productKey) external view returns (uint256);

  function isCoverNormal(bytes32 coverKey) external view returns (bool);

  function getStakes(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external view returns (uint256, uint256);

  function getStakesOf(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address account
  ) external view returns (uint256, uint256);
}
