// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./Unstakable.sol";
import "../../../interfaces/IResolution.sol";

/**
 *
 * @title Resolution Contract
 * @dev This contract enables governance agents or admins to resolve
 * actively-reporting cover products. Once a resolution occurs, the
 * NPM token holders who voted for the valid camp can unstake
 * their stakes after resolution and before finalization
 * with additional rewards.
 *
 */
contract Resolution is IResolution, Unstakable {
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
    return ProtoUtilV1.CNAME_RESOLUTION;
  }
}
