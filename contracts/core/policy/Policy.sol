// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../dependencies/BokkyPooBahsDateTimeLibrary.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/ICxTokenFactory.sol";
import "../../interfaces/ICxToken.sol";
import "../../interfaces/IPolicy.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/RegistryLibV1.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/PolicyHelperV1.sol";
import "../../libraries/RoutineInvokerLibV1.sol";
import "../Recoverable.sol";

/**
 * @title Policy Contract
 * @dev The policy contract enables you to a purchase cover
 */
contract Policy is IPolicy, Recoverable {
  using PolicyHelperV1 for IStore;
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ValidationLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StrategyLibV1 for IStore;

  uint256 public lastPolicyId;

  constructor(IStore store, uint256 _lastPolicyId) Recoverable(store) {
    lastPolicyId = _lastPolicyId;
  }

  /**
   * @dev Purchase cover for the specified amount. <br /> <br />
   * When you purchase covers, you receive equal amount of cxTokens back.
   * You need the cxTokens to claim the cover when resolution occurs.
   * Each unit of cxTokens are fully redeemable at 1:1 ratio to the given
   * stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.
   *
   * https://docs.neptunemutual.com/covers/purchasing-covers
   *
   * ## Payouts and Incident Date
   *
   * @custom:note Please take note of the following key differences:
   *
   * **Event Date or Observed Date**
   *
   * The date and time the event took place in the real world.
   * It is also referred to as the **event date**.
   *
   * **Incident Date**
   *
   * The incident date is the timestamp at which an event report is submitted.
   * Only if the incident date falls within your coverage period
   * and resolution is in your favor, will you receive a claims payout.
   *
   * **Claim Period**
   *
   * In contrast to most DeFi cover protocols, Neptune Mutual has no waiting period
   * between submitting a claim and receiving payout. You can access the claims feature
   * to immediately receive a payout if a cover is successfully resolved as Incident Happened.
   *
   * Please note that after an incident is resolved, there is usually a 7-day claim period.
   * Any claim submitted after the claim period expiry is automatically denied.
   *
   * @custom:warning Warning:
   *
   * Please thoroughly review the cover rules, cover exclusions,
   * and standard exclusions before purchasing a cover.
   *
   * If the resolution does not go in your favour, you will not be able to
   * submit a claim or receive a payout.
   *
   * By using the this function on our UI, directly via a smart contract call,
   * through an explorer service such as Etherscan,
   * through an SDK and/or API, or in any other way,
   * you are fully aware, fully understand, and accept the risk
   * of getting your claim(s) denied.
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   *
   * @param onBehalfOf Enter an address you would like to send the claim tokens (cxTokens) to.
   * @param coverKey Enter the cover key you wish to purchase the policy for
   * @param productKey Enter the product key you wish to purchase the policy for
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin to cover.
   * @param referralCode Enter referral code if apllicable
   */
  function purchaseCover(
    address onBehalfOf,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover,
    bytes32 referralCode
  ) external override nonReentrant returns (address, uint256) {
    // @todo: When the POT system is replaced with NPM tokens in the future, upgrade this contract
    // and uncomment the following line
    // require(IERC20(s.getNpmTokenAddress()).balanceOf(msg.sender) >= 1 ether, "No NPM balance");
    require(coverKey > 0, "Invalid cover key");
    require(onBehalfOf != address(0), "Invalid `onBehalfOf`");
    require(amountToCover > 0, "Enter an amount");
    require(coverDuration > 0 && coverDuration <= ProtoUtilV1.MAX_POLICY_DURATION, "Invalid cover duration");

    s.mustNotBePaused();
    s.mustNotExceedProposalThreshold(amountToCover);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.mustHaveNormalProductStatus(coverKey, productKey);
    s.mustNotHavePolicyDisabled(coverKey, productKey);
    s.senderMustBeWhitelistedIfRequired(coverKey, productKey, onBehalfOf);

    lastPolicyId += 1;

    (ICxToken cxToken, uint256 fee, uint256 platformFee) = s.purchaseCoverInternal(onBehalfOf, coverKey, productKey, coverDuration, amountToCover);

    emit CoverPurchased(coverKey, productKey, onBehalfOf, address(cxToken), fee, platformFee, amountToCover, cxToken.expiresOn(), referralCode, lastPolicyId);
    return (address(cxToken), lastPolicyId);
  }

  /**
   * @dev Gets cxToken and its expiry address by the supplied arguments.
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param coverKey Enter the cover key
   * @param productKey Enter the cover key
   * @param coverDuration Enter the cover's policy duration. Valid values: 1-3.
   *
   */
  function getCxToken(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration
  ) external view override returns (address cxToken, uint256 expiryDate) {
    require(coverDuration > 0 && coverDuration <= ProtoUtilV1.MAX_POLICY_DURATION, "Invalid cover duration");

    return s.getCxTokenInternal(coverKey, productKey, coverDuration);
  }

  /**
   * @dev Returns cxToken address by the cover key, product key, and expiry date.
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param coverKey Enter the cover key
   * @param productKey Enter the cover key
   * @param expiryDate Enter the cxToken's expiry date
   *
   */
  function getCxTokenByExpiryDate(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 expiryDate
  ) external view override returns (address cxToken) {
    return s.getCxTokenByExpiryDateInternal(coverKey, productKey, expiryDate);
  }

  /**
   * @dev Gets the expiry date based on cover duration
   * @param today Enter the current timestamp
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   *
   */
  function getExpiryDate(uint256 today, uint256 coverDuration) external pure override returns (uint256) {
    return CoverUtilV1.getExpiryDateInternal(today, coverDuration);
  }

  /**
   * @dev Gets the sum total of cover commitment that has not expired yet.
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param coverKey Enter the cover key
   * @param productKey Enter the cover key
   */
  function getCommitment(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    uint256 precision = s.getStablecoinPrecision();
    return s.getActiveLiquidityUnderProtection(coverKey, productKey, precision);
  }

  /**
   * @dev Gets the available liquidity in the pool.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter the cover key
   * 
   */
  function getAvailableLiquidity(bytes32 coverKey) external view override returns (uint256) {
    return s.getStablecoinOwnedByVaultInternal(coverKey);
  }

  /**
   * @dev Gets the cover fee info for the given cover key, duration, and amount
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter the cover key
   * @param productKey Enter the product key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin to cover.
   *
   */
  function getCoverFeeInfo(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover
  )
    external
    view
    override
    returns (
      uint256 fee,
      uint256 utilizationRatio,
      uint256 totalAvailableLiquidity,
      uint256 floor,
      uint256 ceiling,
      uint256 rate
    )
  {
    return s.calculatePolicyFeeInternal(coverKey, productKey, coverDuration, amountToCover);
  }

  /**
   * @dev Returns the values of the given cover key
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter the cover key
   * @param productKey Enter the product key
   *
   * @param _values[0] The total amount in the cover pool
   * @param _values[1] The total commitment amount
   * @param _values[2] Reassurance amount
   * @param _values[3] Reassurance pool weight
   * @param _values[4] Count of products under this cover
   * @param _values[5] Leverage
   * @param _values[6] Cover product efficiency weight
   *
   */
  function getCoverPoolSummary(bytes32 coverKey, bytes32 productKey) external view override returns (uint256[] memory _values) {
    return s.getCoverPoolSummaryInternal(coverKey, productKey);
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
    return ProtoUtilV1.CNAME_POLICY;
  }
}
