// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IMember.sol";

interface ICoverReassurance is IMember {
  event ReassuranceAdded(bytes32 indexed coverKey, uint256 amount);
  event WeightSet(bytes32 indexed coverKey, uint256 weight);

  /**
   * @dev Adds reassurance to the specified cover contract
   * @param coverKey Enter the cover key
   * @param amount Enter the amount you would like to supply
   */
  function addReassurance(
    bytes32 coverKey,
    address account,
    uint256 amount
  ) external;

  function setWeight(bytes32 coverKey, uint256 weight) external;

  function capitalizePool(bytes32 coverKey, uint256 incidentDate) external;

  /**
   * @dev Gets the reassurance amount of the specified cover contract
   * @param coverKey Enter the cover key
   */
  function getReassurance(bytes32 coverKey) external view returns (uint256);
}
