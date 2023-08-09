// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../Recoverable.sol";
import "../../libraries/CoverLibV2.sol";
import "../../interfaces/ICoverUpdate.sol";

/**
 * @title CoverUpdate Contract
 * @dev The cover contract enables you to delete onchain covers or products.
 *
 */
contract CoverUpdate is Recoverable, ICoverUpdate {
  using CoverLibV2 for IStore;
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for IStore;

  /**
   * @dev Constructs this contract
   * @param store Enter the store
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  function deleteCover(bytes32 coverKey) public override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 liquidityThreshold = 10 ** s.getStablecoinPrecisionInternal();
    s.deleteCoverInternal(coverKey, liquidityThreshold);

    emit CoverDeleted(coverKey);
  }

  function deleteProduct(bytes32 coverKey, bytes32 productKey) public override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    s.deleteProductInternal(coverKey, productKey);

    emit ProductDeleted(coverKey, productKey);
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
    return "CoverUpdate";
  }
}
