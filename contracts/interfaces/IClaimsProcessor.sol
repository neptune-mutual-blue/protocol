// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IMember.sol";

interface IClaimsProcessor is IMember {
  event Claimed(address indexed cToken, bytes32 indexed key, address indexed account, uint256 incidentDate, uint256 amount);

  function claim(
    address cToken,
    bytes32 key,
    uint256 incidentDate,
    uint256 amount
  ) external;

  function validate(
    address cToken,
    bytes32 key,
    uint256 incidentDate
  ) external view returns (bool);
}
