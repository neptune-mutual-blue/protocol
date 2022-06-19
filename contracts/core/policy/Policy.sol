// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
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
import "../../libraries/NTransferUtilV2.sol";
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
   * @param onBehalfOf Enter an address you would like to send the claim tokens (cxTokens) to.
   * @param coverKey Enter the cover key you wish to purchase the policy for
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin `liquidityToken` to cover.
   */
  function purchaseCover(
    address onBehalfOf,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover,
    bytes32 referralCode
  ) external override nonReentrant returns (address, uint256) {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.mustHaveNormalCoverStatus(coverKey);
    s.mustBeSupportedProductOrEmpty(coverKey, productKey);
    s.senderMustBeWhitelistedIfRequired(coverKey, productKey, onBehalfOf);

    // @todo: When the voucher system is replaced with NPM tokens in the future, uncomment the following line
    // require(IERC20(s.getNpmTokenAddress()).balanceOf(msg.sender) >= 1 ether, "No NPM balance");
    require(onBehalfOf != address(0), "Invalid `onBehalfOf`");
    require(amountToCover > 0, "Please specify amount");
    require(coverDuration > 0 && coverDuration <= 3, "Invalid cover duration");

    lastPolicyId += 1;

    (ICxToken cxToken, uint256 fee, uint256 platformFee) = s.purchaseCoverInternal(onBehalfOf, coverKey, productKey, coverDuration, amountToCover);

    emit CoverPurchased(coverKey, productKey, onBehalfOf, address(cxToken), fee, platformFee, amountToCover, cxToken.expiresOn(), referralCode, lastPolicyId);
    return (address(cxToken), lastPolicyId);
  }

  function getCxToken(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration
  ) external view override returns (address cxToken, uint256 expiryDate) {
    return s.getCxTokenInternal(coverKey, productKey, coverDuration);
  }

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
   */
  function getExpiryDate(uint256 today, uint256 coverDuration) external pure override returns (uint256) {
    return CoverUtilV1.getExpiryDateInternal(today, coverDuration);
  }

  /**
   * Gets the sum total of cover commitment that has not expired yet.
   */
  function getCommitment(bytes32 coverKey, bytes32 productKey) external view override returns (uint256) {
    uint256 precision = 10**IERC20Detailed(s.getStablecoin()).decimals();
    return s.getActiveLiquidityUnderProtection(coverKey, productKey, precision);
  }

  /**
   * Gets the available liquidity in the pool.
   */
  function getAvailableLiquidity(bytes32 coverKey) external view override returns (uint256) {
    return s.getStablecoinOwnedByVaultInternal(coverKey);
  }

  /**
   * @dev Gets the cover fee info for the given cover key, duration, and amount
   * @param coverKey Enter the cover key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin `liquidityToken` to cover.
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
   * @param _values[0] The total amount in the cover pool
   * @param _values[1] The total commitment amount
   * @param _values[2] Reassurance amount
   * @param _values[3] Reassurance pool weight
   * @param _values[4] Count of products under this cover
   * @param _values[5] Leverage
   * @param _values[6] Cover product efficiency weight
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
