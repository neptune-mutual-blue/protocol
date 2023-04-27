// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/security/Pausable.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

abstract contract WithPausability is Pausable, Ownable {
  mapping(address => bool) public pausers;

  event PausersSet(address indexed addedBy, address[] accounts, bool[] statuses);

  /**
   *
   * @dev Accepts a list of accounts and their respective statuses for addition or removal as pausers.
   *
   * @custom:suppress-reentrancy Risk tolerable. Can only be called by the owner.
   * @custom:suppress-address-trust-issue Risk tolerable.
   */
  function setPausers(address[] calldata accounts, bool[] calldata statuses) external onlyOwner whenNotPaused {
    require(accounts.length > 0, "No pauser specified");
    require(accounts.length == statuses.length, "Invalid args");

    for (uint256 i = 0; i < accounts.length; i++) {
      pausers[accounts[i]] = statuses[i];
    }

    emit PausersSet(msg.sender, accounts, statuses);
  }

  /**
   * @dev Pauses the token
   *
   * @custom:suppress-reentrancy Risk tolerable. Can only be called by a pauser.
   *
   */
  function pause() external {
    require(pausers[msg.sender], "Forbidden");
    super._pause();
  }

  /**
   * @dev Unpauses the token
   *
   * @custom:suppress-reentrancy Risk tolerable. Can only be called by the owner.
   *
   */
  function unpause() external onlyOwner {
    super._unpause();
  }
}
