// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

interface IFinalization {
  event Finalized(bytes32 indexed coverKey, bytes32 indexed productKey, address finalizer, uint256 indexed incidentDate);

  function finalize(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external;
}
