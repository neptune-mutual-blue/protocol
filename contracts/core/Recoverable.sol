// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";
import "../libraries/BaseLibV1.sol";
import "../libraries/ValidationLibV1.sol";

abstract contract Recoverable is ReentrancyGuard {
  IStore public s;

  constructor(IStore store) {
    require(address(store) != address(0), "Invalid Store");
    s = store;
  }

  /**
   * @dev Recover all Ether held by the contract.
   * On success, no event is emitted because the recovery feature does
   * not have any significance in the SDK or the UI.
   */
  function recoverEther(address sendTo) external nonReentrant {
    // @suppress-pausable Already implemented in BaseLibV1
    // @suppress-acl Already implemented in BaseLibV1 --> mustBeRecoveryAgent
    BaseLibV1.recoverEther(s, sendTo);
  }

  /**
   * @dev Recover all IERC-20 compatible tokens sent to this address.
   * On success, no event is emitted because the recovery feature does
   * not have any significance in the SDK or the UI.
   * @param token IERC-20 The address of the token contract
   */
  function recoverToken(address token, address sendTo) external nonReentrant {
    // @suppress-pausable Already implemented in BaseLibV1
    // @suppress-acl Already implemented in BaseLibV1 --> mustBeRecoveryAgent
    BaseLibV1.recoverToken(s, token, sendTo);
  }
}
