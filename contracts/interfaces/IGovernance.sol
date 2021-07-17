// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IReporter.sol";
import "./IWitness.sol";
import "./IMember.sol";

interface IGovernance is IMember, IReporter, IWitness {
  event Finalized(bytes32 indexed key, address indexed finalizer, uint256 indexed incidentDate);

  function finalize(bytes32 key, uint256 incidentDate) external;
}
