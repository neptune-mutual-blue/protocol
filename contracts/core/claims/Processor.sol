// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../Recoverable.sol";
import "../../interfaces/IClaimsProcessor.sol";
import "../../interfaces/ICxToken.sol";
import "../../interfaces/IVault.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/RegistryLibV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/RoutineInvokerLibV1.sol";

/**
 * @title Claims Processor Contract
 * @dev Enables the policyholders to submit a claim and receive immediate payouts during claim period.
 * The claims which are submitted after the claim expiry period are considered invalid
 * and therefore receive no payouts.
 */
contract Processor is IClaimsProcessor, Recoverable {
  using GovernanceUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;

  /**
   * @dev Constructs this contract
   * @param store Provide an implementation of IStore
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Enables policyholders to claim their cxTokens which results in a payout.
   * The payout is provided only when the active cover is marked and resolved as "Incident Happened".
   *
   * @param cxToken Provide the address of the claim token that you're using for this claim.
   * @param coverKey Enter the key of the cover you're claiming
   * @param incidentDate Enter the active cover's date of incident
   * @param amount Enter the amount of cxTokens you want to transfer
   */
  function claim(
    address cxToken,
    bytes32 coverKey,
    uint256 incidentDate,
    uint256 amount
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    // @suppress-pausable Already implemented in the function `validate`
    // @suppress-address-trust-issue The `cxToken` address can be trusted because it is being checked in the function `validate`.
    // @suppress-malicious-erc20 The function `NTransferUtilV2.ensureTransferFrom` checks if `cxToken` acts funny.

    validate(cxToken, coverKey, incidentDate);
    require(amount > 0, "Enter an amount");

    IERC20(cxToken).ensureTransferFrom(msg.sender, address(this), amount);
    ICxToken(cxToken).burn(amount);

    IVault vault = s.getVault(coverKey);
    address finalReporter = s.getReporterInternal(coverKey, incidentDate);

    s.addClaimPayoutsInternal(coverKey, incidentDate, amount);

    // @suppress-division Checked side effects. If the claim platform fee is zero
    // or a very small number, platform fee becomes zero due to data loss.
    uint256 platformFee = (amount * s.getClaimPlatformFeeInternal()) / ProtoUtilV1.MULTIPLIER;

    // @suppress-division Checked side effects. If the claim reporter commission is zero
    // or a very small number, reporterFee fee becomes zero due to data loss.

    // slither-disable-next-line divide-before-multiply
    uint256 reporterFee = (platformFee * s.getClaimReporterCommissionInternal()) / ProtoUtilV1.MULTIPLIER;
    uint256 claimed = amount - platformFee;

    vault.transferGovernance(coverKey, msg.sender, claimed);

    if (reporterFee > 0) {
      vault.transferGovernance(coverKey, finalReporter, reporterFee);
    }

    if (platformFee - reporterFee > 0) {
      // @suppress-subtraction The following (or above) subtraction can cause
      // an underflow if `getClaimReporterCommissionInternal` is greater than 100%.
      // @check:  getClaimReporterCommissionInternal < ProtoUtilV1.MULTIPLIER
      vault.transferGovernance(coverKey, s.getTreasury(), platformFee - reporterFee);
    }

    s.updateStateAndLiquidity(coverKey);

    emit Claimed(cxToken, coverKey, incidentDate, msg.sender, finalReporter, amount, reporterFee, platformFee, claimed);
  }


  /**
   * @dev Validates a given claim
   * @param cxToken Provide the address of the claim token that you're using for this claim.
   * @param coverKey Enter the key of the cover you're validating the claim for
   * @param incidentDate Enter the active cover's date of incident
   * @return Returns true if the given claim is valid and can result in a successful payout
   */
  function validate(
    address cxToken,
    bytes32 coverKey,
    uint256 incidentDate
  ) public view override returns (bool) {
    s.mustNotBePaused();
    s.mustBeValidClaim(coverKey, cxToken, incidentDate);

    return true;
  }

  /**
   * @dev Returns claim expiry date. A policy can not be claimed after the expiry date
   * even when the policy was valid.
   * @param coverKey Enter the key of the cover you're checking
   */
  function getClaimExpiryDate(bytes32 coverKey) external view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey);
  }

  function setClaimPeriod(bytes32 coverKey, uint256 value) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);

    require(value > 0, "Please specify value");

    uint256 previous;

    if (coverKey > 0) {
      previous = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey);
      s.setUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey, value);
      emit ClaimPeriodSet(coverKey, previous, value);
      return;
    }

    previous = s.getUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD, value);

    emit ClaimPeriodSet(coverKey, previous, value);
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
    return ProtoUtilV1.CNAME_CLAIMS_PROCESSOR;
  }
}
