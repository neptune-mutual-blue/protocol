// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./Reporter.sol";
import "../../interfaces/IGovernance.sol";

/**
 * @title Governance Contract
 *
 * @dev The governance contract permits any NPM tokenholder to submit a report
 * by staking a minimum number of NPM tokens as set in the cover pool.
 *
 * <br /> <br />
 *
 * The reporting procedure begins when an incident report is received and often takes seven days or longer,
 * depending on the configuration of a cover. It also allows subsequent reporters to submit their stakes
 * in support of the initial report or to add stakes to dispute it.
 *
 * <br /> <br />
 *
 * **Warning:**
 *
 * <br /> <br />
 *
 * Please carefully check the cover rules, cover exclusions, and standard exclusion
 * in detail before you interact with the Governance contract(s). Your entire stake will be forfeited
 * if resolution does not go in your favor. You will be able to unstake
 * and receive back your NPM only if:
 *
 * - incident resolution is in your favor
 * - after reporting period ends
 *
 * <br /> <br />
 *
 * **By using this contract directly via a smart contract call,
 * through an explorer service such as Etherscan, using an SDK and/or API, or in any other way,
 * you are completely aware, fully understand, and accept the risk that you may lose all of
 * your stake.**
 *
 */
contract Governance is IGovernance, Reporter {
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

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
