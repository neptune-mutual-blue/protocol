// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
// solhint-disable function-max-lines
pragma solidity ^0.8.0;
import "../Recoverable.sol";
import "../../interfaces/IClaimsProcessor.sol";
import "../../interfaces/ICxToken.sol";
import "../../interfaces/IVault.sol";
import "../../libraries/NTransferUtilV2.sol";

/**
 * @title Claims Processor Contract
 *
 * @dev The claims processor contract allows policyholders to file a claim and get instant payouts during the claim period.
 *
 * <br /> <br />
 *
 * There is a lag period before a policy begins coverage.
 * After the next day's UTC EOD timestamp, policies take effect and are valid until the expiration period.
 * Check [ProtoUtilV1.NS_COVERAGE_LAG](ProtoUtilV1.md) and [PolicyAdmin.getCoverageLag](PolicyAdmin.md#getcoveragelag)
 * for more information on the lag configuration.
 *
 * <br /> <br />
 *
 * If a claim isn't made during the claim period, it isn't valid and there is no payout.
 *
 */
contract Processor is IClaimsProcessor, Recoverable {
  using GovernanceUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;

  /**
   * @dev Constructs this contract
   *
   * @param store Provide an implementation of IStore
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Enables a policyholder to receive a payout redeeming cxTokens.
   * Only when the active cover is marked as "Incident Happened" and
   * has "Claimable" status is the payout made.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   * @custom:suppress-pausable Pausable logic is implemented inside the `validate` call
   * @custom:suppress-address-trust-issue The `cxToken` address is checked in the `validate` call
   * @custom:suppress-malicious-erc The malicious ERC-20 `cxToken` should only be invoked via `NTransferUtil`
   * @param cxToken Provide the address of the claim token that you're using for this claim.
   *
   * @param coverKey Enter the key of the cover you're claiming
   * @param productKey Enter the key of the product you're claiming
   * @param incidentDate Enter the active cover's date of incident
   * @param amount Enter the amount of cxTokens you want to transfer
   *
   */
  function claim(
    address cxToken,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 amount
  ) external override nonReentrant {
    validate(cxToken, coverKey, productKey, incidentDate, amount);

    IERC20(cxToken).ensureTransferFrom(msg.sender, address(this), amount);
    ICxToken(cxToken).burn(amount);

    IVault vault = s.getVault(coverKey);
    address finalReporter = s.getReporterInternal(coverKey, productKey, incidentDate);

    uint256 stablecoinPrecision = s.getStablecoinPrecisionInternal();
    uint256 payout = (amount * stablecoinPrecision) / ProtoUtilV1.CXTOKEN_PRECISION;

    require(payout > 0, "Invalid payout");

    s.addClaimPayoutsInternal(coverKey, productKey, incidentDate, payout);

    // @suppress-zero-value-check Checked side effects. If the claim platform fee is zero
    // or a very small number, platform fee becomes zero due to data loss.
    uint256 platformFee = (payout * s.getPlatformCoverFeeRateInternal()) / ProtoUtilV1.MULTIPLIER;

    // @suppress-zero-value-check Checked side effects. If the claim reporter commission rate is zero
    // or a very small number, reporterFee fee becomes zero due to data loss.
    uint256 reporterFee = (platformFee * s.getClaimReporterCommissionInternal()) / ProtoUtilV1.MULTIPLIER;

    require(payout >= platformFee, "Invalid platform fee");

    uint256 claimed = payout - platformFee;

    // @suppress-zero-value-check If the platform fee rate was 100%,
    // "claimed" can be zero
    if (claimed > 0) {
      vault.transferGovernance(coverKey, msg.sender, claimed);
    }

    if (reporterFee > 0) {
      vault.transferGovernance(coverKey, finalReporter, reporterFee);
    }

    if (platformFee - reporterFee > 0) {
      // @suppress-subtraction The following (or above) subtraction can cause
      // an underflow if `getClaimReporterCommissionInternal` is greater than 100%.
      vault.transferGovernance(coverKey, s.getTreasuryAddressInternal(), platformFee - reporterFee);
    }

    s.updateStateAndLiquidityInternal(coverKey);

    emit Claimed(cxToken, coverKey, productKey, incidentDate, msg.sender, finalReporter, amount, reporterFee, platformFee, claimed);
  }

  /**
   * @dev Validates a given claim
   *
   * @param cxToken Provide the address of the claim token that you're using for this claim.
   * @param coverKey Enter the key of the cover you're validating the claim for
   * @param productKey Enter the key of the product you're validating the claim for
   * @param incidentDate Enter the active cover's date of incident
   *
   * @return If the given claim is valid and can result in a successful payout, returns true.
   *
   */
  function validate(
    address cxToken,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    uint256 amount
  ) public view override returns (bool) {
    s.mustNotBePaused();
    s.mustBeValidClaim(msg.sender, coverKey, productKey, cxToken, incidentDate, amount);
    require(isBlacklisted(coverKey, productKey, incidentDate, msg.sender) == false, "Access denied");
    require(amount > 0, "Enter an amount");

    require(s.getClaimReporterCommissionInternal() <= ProtoUtilV1.MULTIPLIER, "Invalid claim reporter fee");
    require(s.getPlatformCoverFeeRateInternal() <= ProtoUtilV1.MULTIPLIER, "Invalid platform fee rate");

    return true;
  }

  /**
   * @dev Returns claim expiration date.
   * Even if the policy was still valid, it cannot be claimed after the claims expiry date.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter the key of the cover you're checking
   * @param productKey Enter the key of the product you're checking
   *
   */
  function getClaimExpiryDate(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_CLAIM_EXPIRY_TS, coverKey, productKey);
  }

  /**
   * @dev Sets the cover's claim period using its key.
   * If no cover key is specified, the value specified here will be used as a fallback.
   * Covers without a specified claim period default to the fallback value.
   *
   * @param coverKey Enter the coverKey you want to set the claim period for
   * @param value Enter a claim period you want to set
   *
   */
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
   * @dev Accounts that are on a blacklist can't claim their cxTokens.
   * Cover managers can stop an account from claiming their cover by putting it on the blacklist.
   * Usually, this happens when we suspect a policyholder is the attacker.
   *
   * <br /> <br />
   *
   * After performing KYC, we might be able to lift the blacklist.
   *
   * @param coverKey Enter the cover key
   * @param productKey Enter the product key
   * @param incidentDate Enter the incident date of the cover
   * @param accounts Enter list of accounts you want to blacklist
   * @param statuses Enter true if you want to blacklist. False if you want to remove from the blacklist.
   */
  function setBlacklist(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address[] calldata accounts,
    bool[] calldata statuses
  ) external override nonReentrant {
    // @suppress-zero-value-check Checked
    require(accounts.length > 0, "Invalid accounts");
    require(accounts.length == statuses.length, "Invalid args");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeCoverManager(s);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustBeValidIncidentDate(coverKey, productKey, incidentDate);

    for (uint256 i = 0; i < accounts.length; i++) {
      s.setAddressBooleanByKey(CoverUtilV1.getBlacklistKeyInternal(coverKey, productKey, incidentDate), accounts[i], statuses[i]);
      emit BlacklistSet(coverKey, productKey, incidentDate, accounts[i], statuses[i]);
    }
  }

  /**
   * @dev Check to see if an account is blacklisted/banned from making a claim.
   *
   * @param coverKey Enter the cover key
   * @param coverKey Enter the product key
   * @param incidentDate Enter the incident date of this cover
   * @param account Enter the account to see if it is blacklisted
   *
   */
  function isBlacklisted(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    address account
  ) public view override returns (bool) {
    return s.getAddressBooleanByKey(CoverUtilV1.getBlacklistKeyInternal(coverKey, productKey, incidentDate), account);
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
