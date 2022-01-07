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

/**
 * @title Claims Processor Contract
 * @dev Enables the policyholders to submit a claim and receive immediate payouts during claim period.
 * The claims which are submitted after the claim expiry period are considered invalid
 * and therefore receive no payouts.
 */
contract Processor is IClaimsProcessor, Recoverable {
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ValidationLibV1 for IStore;
  using ValidationLibV1 for bytes32;
  using StoreKeyUtil for IStore;
  using GovernanceUtilV1 for IStore;

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
   * @param key Enter the key of the cover you're claiming
   * @param incidentDate Enter the active cover's date of incident
   * @param amount Enter the amount of cxTokens you want to transfer
   */
  function claim(
    address cxToken,
    bytes32 key,
    uint256 incidentDate,
    uint256 amount
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    // @suppress-pausable Already implemented in the function `validate`
    // @suppress-address-trust-issue The `cxToken` address can be trusted because it is being checked in the function `validate`.
    // @suppress-malicious-erc20 The function `NTransferUtilV2.ensureTransferFrom` checks if `cxToken` acts funny.

    validate(cxToken, key, incidentDate);

    IERC20(cxToken).ensureTransferFrom(msg.sender, address(this), amount);
    ICxToken(cxToken).burn(amount);

    IVault vault = s.getVault(key);
    address finalReporter = s.getReporter(key, incidentDate);

    uint256 platformFee = (amount * s.getClaimPlatformFee()) / ProtoUtilV1.PERCENTAGE_DIVISOR;
    // slither-disable-next-line divide-before-multiply
    uint256 reporterFee = (platformFee * s.getClaimReporterCommission()) / ProtoUtilV1.PERCENTAGE_DIVISOR;
    uint256 claimed = amount - platformFee;

    vault.transferGovernance(key, msg.sender, claimed);
    vault.transferGovernance(key, finalReporter, reporterFee);
    vault.transferGovernance(key, s.getTreasury(), platformFee - reporterFee);

    emit Claimed(cxToken, key, incidentDate, msg.sender, finalReporter, amount, reporterFee, platformFee, claimed);
  }

  /**
   * @dev Validates a given claim
   * @param cxToken Provide the address of the claim token that you're using for this claim.
   * @param key Enter the key of the cover you're validating the claim for
   * @param incidentDate Enter the active cover's date of incident
   * @return Returns true if the given claim is valid and can result in a successful payout
   */
  function validate(
    address cxToken,
    bytes32 key,
    uint256 incidentDate
  ) public view override returns (bool) {
    s.mustNotBePaused();
    s.mustBeValidClaim(key, cxToken, incidentDate);

    return true;
  }

  /**
   * @dev Returns claim expiry date. A policy can not be claimed after the expiry date
   * even when the policy was valid.
   * @param key Enter the key of the cover you're checking
   */
  function getClaimExpiryDate(bytes32 key) external view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, key);
  }

  function setClaimPeriod(uint256 value) external override nonReentrant {
    ValidationLibV1.mustNotBePaused(s);
    AccessControlLibV1.mustBeCoverManager(s);

    uint256 previous = s.getUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD);
    s.setUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD, value);

    emit ClaimPeriodSet(previous, value);
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
