// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IMember.sol";

interface IClaimsProcessor is IMember {
  event Claimed(address indexed cxToken, bytes32 indexed key, address indexed account, uint256 incidentDate, uint256 amount);

  function claim(
    address cxToken,
    bytes32 key,
    uint256 incidentDate,
    uint256 amount
  ) external;

  function validate(
    address cxToken,
    bytes32 key,
    uint256 incidentDate
  ) external view returns (bool);

  function getClaimExpiryDate(bytes32 key) external view returns (uint256);
}
