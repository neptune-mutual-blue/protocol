// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IMember.sol";

interface IClaimsProcessor is IMember {
  event Claimed(
    address indexed cxToken,
    bytes32 indexed coverKey,
    uint256 incidentDate,
    address indexed account,
    address reporter,
    uint256 amount,
    uint256 reporterFee,
    uint256 platformFee,
    uint256 claimed
  );
  event ClaimPeriodSet(bytes32 indexed coverKey, uint256 previous, uint256 current);

  function claim(
    address cxToken,
    bytes32 coverKey,
    uint256 incidentDate,
    uint256 amount
  ) external;

  function validate(
    address cxToken,
    bytes32 coverKey,
    uint256 incidentDate
  ) external view returns (bool);

  function setClaimPeriod(bytes32 coverKey, uint256 value) external;

  function getClaimExpiryDate(bytes32 coverKey) external view returns (uint256);
}
