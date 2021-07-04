// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IMember.sol";

interface ICoverAssurance is IMember {
  event AssuranceAdded(bytes32 key, uint256 amount);

  /**
   * @dev Adds assurance to the specified cover contract
   * @param key Enter the cover key
   * @param amount Enter the amount you would like to supply
   */
  function addAssurance(
    bytes32 key,
    address account,
    uint256 amount
  ) external;

  function setWeight(bytes32 key, uint256 weight) external;

  /**
   * @dev Gets the assurance amount of the specified cover contract
   * @param key Enter the cover key
   */
  function getAssurance(bytes32 key) external returns (uint256);
}
