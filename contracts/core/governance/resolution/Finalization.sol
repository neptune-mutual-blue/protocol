// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../../Recoverable.sol";
import "../../../interfaces/IFinalization.sol";
import "../../../libraries/GovernanceUtilV1.sol";
import "../../../libraries/ValidationLibV1.sol";
import "../../../libraries/RoutineInvokerLibV1.sol";

/**
 * @title Finalization Contract
 * @dev This contract allows governance agents "finalize"
 * a resolved cover product after the claim period.
 *
 * When a cover product is finalized, it resets back to normal
 * state where tokenholders can again supply liquidity
 * and purchase policies.
 */
abstract contract Finalization is Recoverable, IFinalization {
  using GovernanceUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using ValidationLibV1 for bytes32;

  /**
   * Finalizes a cover pool or a product contract.
   * Once finalized, the cover resets back to the normal state.
   *
   * Note:
   *
   * An incident can be finalized:
   *
   * - by a governance agent
   * - if it was reported and resolved
   * - after claim period
   * - after reassurance fund is capitalized back to the liquidity pool
   *
   * @param coverKey Enter the cover key you want to finalize
   * @param productKey Enter the product key you want to finalize
   * @param incidentDate Enter the date of this incident reporting
   */
  function finalize(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external override nonReentrant {
    require(incidentDate > 0, "Please specify incident date");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeGovernanceAgent(s);

    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);
    s.mustBeClaimingOrDisputed(coverKey, productKey);
    s.mustBeAfterResolutionDeadline(coverKey, productKey);
    s.mustBeAfterClaimExpiry(coverKey, productKey);

    uint256 transferable = s.getReassuranceTransferrableInternal(coverKey, productKey, incidentDate);
    require(transferable == 0, "Pool must be capitalized");

    _finalize(coverKey, productKey, incidentDate);
  }

  function _finalize(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) private {
    // Reset to normal
    // @note: do not pass incident date as we need status by key and incident date for historical significance
    s.setStatusInternal(coverKey, productKey, 0, CoverUtilV1.ProductStatus.Normal);

    s.deleteUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, productKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_GOVERNANCE_RESOLUTION_TS, coverKey, productKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_CLAIM_BEGIN_TS, coverKey, productKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey);

    s.deleteAddressByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey, productKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey, productKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_RESOLUTION_DEADLINE, coverKey, productKey);
    s.deleteBoolByKey(GovernanceUtilV1.getHasDisputeKeyInternal(coverKey, productKey));

    // @warning: do not uncomment these lines as these vales are required to enable unstaking any time after finalization
    // s.deleteAddressByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey);
    // s.deleteAddressByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, coverKey);
    // s.deleteAddressByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_YES, coverKey, incidentDate)));
    // s.deleteAddressByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_GOVERNANCE_REPORTING_WITNESS_NO, coverKey, incidentDate)));

    s.updateStateAndLiquidity(coverKey);
    emit Finalized(coverKey, productKey, msg.sender, incidentDate);
  }
}
