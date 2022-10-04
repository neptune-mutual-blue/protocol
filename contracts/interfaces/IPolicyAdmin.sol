// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface IPolicyAdmin is IMember {
  event CoverPolicyRateSet(bytes32 indexed coverKey, uint256 floor, uint256 ceiling);
  event CoverageLagSet(bytes32 indexed coverKey, uint256 window);

  /**
   * @dev Sets policy rates for the given cover key. This feature is only accessible by owner or protocol owner.
   * @param floor The lowest cover fee rate for this cover
   * @param ceiling The highest cover fee rate for this cover
   */
  function setPolicyRatesByKey(
    bytes32 coverKey,
    uint256 floor,
    uint256 ceiling
  ) external;

  /**
   * @dev Gets the cover policy rates for the given cover key
   */
  function getPolicyRates(bytes32 coverKey) external view returns (uint256 floor, uint256 ceiling);

  function setCoverageLag(bytes32 coverKey, uint256 window) external;

  function getCoverageLag(bytes32 coverKey) external view returns (uint256);
}
