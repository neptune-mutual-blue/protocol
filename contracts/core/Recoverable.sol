// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IRecoverable.sol";
import "../libraries/BaseLibV1.sol";
import "../libraries/ValidationLibV1.sol";

/**
 *
 * @title Recoverable Contract
 * @dev The recoverable contract enables "Recovery Agents" to recover
 * Ether and ERC-20 tokens sent to this address.
 *
 * To learn more about our recovery policy, please refer to the following doc:
 * https://docs.neptunemutual.com/usage/recovering-cryptocurrencies
 *
 */
abstract contract Recoverable is ReentrancyGuard, IRecoverable {
  using ValidationLibV1 for IStore;
  IStore public override s;

  constructor(IStore store) {
    require(address(store) != address(0), "Invalid Store");
    s = store;
  }

  /**
   * @dev Recover all Ether held by the contract.
   * On success, no event is emitted because the recovery feature does
   * not have any significance in the SDK or the UI.
   *
   * @param sendTo Wallet address where we send the recovered ether 
   */
  function recoverEther(address sendTo) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeRecoveryAgent(s);
    BaseLibV1.recoverEtherInternal(sendTo);
  }

  /**
   * @dev Recover all ERC-20 compatible tokens sent to this address.
   * On success, no event is emitted because the recovery feature does
   * not have any significance in the SDK or the UI.
   *
   * @custom:suppress-malicious-erc The malicious ERC-20 `token` should only be invoked via `NTransferUtil`.
   * @custom:suppress-address-trust-issue Although the token can't be trusted, the recovery agent has to check the token code manually.
   *
   * @param token ERC-20 The address of the token contract
   * @param sendTo Wallet address where we send the recovered token
   */
  function recoverToken(address token, address sendTo) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeRecoveryAgent(s);
    BaseLibV1.recoverTokenInternal(token, sendTo);
  }
}
