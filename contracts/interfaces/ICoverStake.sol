// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface ICoverStake is IMember {
  event StakeAdded(bytes32 indexed coverKey, address indexed account, uint256 amount);
  event StakeRemoved(bytes32 indexed coverKey, address indexed account, uint256 amount);
  event FeeBurned(bytes32 indexed coverKey, uint256 amount);

  /**
   * @dev Increase the stake of the given cover pool
   * @param coverKey Enter the cover key
   * @param account Enter the account from where the NPM tokens will be transferred
   * @param amount Enter the amount of stake
   * @param fee Enter the fee amount. Note: do not enter the fee if you are directly calling this function.
   */
  function increaseStake(
    bytes32 coverKey,
    address account,
    uint256 amount,
    uint256 fee
  ) external;

  /**
   * @dev Decreases the stake from the given cover pool
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of stake to decrease
   */
  function decreaseStake(bytes32 coverKey, uint256 amount) external;

  /**
   * @dev Gets the stake of an account for the given cover key
   * @param coverKey Enter the cover key
   * @param account Specify the account to obtain the stake of
   * @return Returns the total stake of the specified account on the given cover key
   */
  function stakeOf(bytes32 coverKey, address account) external view returns (uint256);
}
