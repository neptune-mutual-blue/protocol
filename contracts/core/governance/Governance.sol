// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./Reporter.sol";
import "../../interfaces/IGovernance.sol";

/**
 * @title Neptune Mutual Governance: Governance Contract
 * @dev The governance contract allows any NPM tokenholder
 * stake a given number of NPM tokens to submit a report.
 * The reporting process begins after an incident report is submitted
 * and usually lasts for 7-days or higher.
 *
 * It also allows follow-on reporters to submit their stakes to support
 * the first reporter or add stakes to dispute the original report.
 */
contract Governance is IGovernance, Reporter {
  using GovernanceUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;

  constructor(IStore store) Recoverable(store) {
    this;
  }

  /**
   * @dev Version number of this contract
   */
  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  /**
   * @dev Name of this contract
   */
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_GOVERNANCE;
  }
}
