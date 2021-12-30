// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./Unstakable.sol";
import "../../../interfaces/IResolution.sol";

/**
 * @title Neptune Mutual Governance: Resolution Contract
 * @dev This contract enables governance agents or admins to resolve
 * actively-reporting cover products. Once a resolution occurs, the
 * NPM token holders who voted for the winning camp can unstake
 * their staking during the claim period with additional rewards.
 */
contract Resolution is IResolution, Unstakable {
  using GovernanceUtilV1 for IStore;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;
  using NTransferUtilV2 for IERC20;

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
