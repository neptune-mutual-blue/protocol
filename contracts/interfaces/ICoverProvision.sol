// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IMember.sol";

interface ICoverProvision is IMember {
  event ProvisionIncreased(bytes32 key, uint256 previous, uint256 current);
  event ProvisionDecreased(bytes32 key, uint256 previous, uint256 current);

  /**
   * @dev Increases NPM provision for the given cover key.
   * This feature is accessible only to the contract owner (governance).
   * @param key Provide the cover key you wish to increase the provision of
   * @param amount Specify the amount of NPM tokens you would like to add
   */
  function increaseProvision(bytes32 key, uint256 amount) external;

  /**
   * @dev Decreases NPM provision for the given cover key
   * This feature is accessible only to the contract owner (governance).
   * @param key Provide the cover key you wish to decrease the provision from
   * @param amount Specify the amount of NPM tokens you would like to decrease
   */
  function decreaseProvision(bytes32 key, uint256 amount) external;

  /**
   * @dev Gets the NPM provision amount for the given cover key
   * @param key Enter the cover key to get the provision
   */
  function getProvision(bytes32 key) external view returns (uint256);
}
