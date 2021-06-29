// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IMember.sol";

interface ICoverAssurance is IMember {
  function addAssurance(
    bytes32 key,
    address account,
    uint256 amount
  ) external;

  function getAssurance(bytes32 key) external returns (uint256);
}
