// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "./ProtoUtilV1.sol";
import "./CoverUtilV1.sol";
import "./ValidationLibV1.sol";
import "./RoutineInvokerLibV1.sol";
import "../interfaces/ICxToken.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IERC20Detailed.sol";
import "../libraries/NTransferUtilV2.sol";

library PolicyHelperV1 {
  using ProtoUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using RegistryLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  uint256 public constant COVER_LAG_FALLBACK_VALUE = 1 days;

  function calculatePolicyFeeInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover
  )
    public
    view
    returns (
      uint256 fee,
      uint256 utilizationRatio,
      uint256 totalAvailableLiquidity,
      uint256 floor,
      uint256 ceiling,
      uint256 rate
    )
  {
    (floor, ceiling) = getPolicyRatesInternal(s, coverKey);
    (uint256 availableLiquidity, uint256 commitment, uint256 reassuranceFund) = _getCoverPoolAmounts(s, coverKey, productKey);

    require(amountToCover > 0, "Please enter an amount");
    require(coverDuration > 0 && coverDuration <= 3, "Invalid duration");
    require(floor > 0 && ceiling > floor, "Policy rate config error");

    require(availableLiquidity - commitment > amountToCover, "Insufficient fund");

    totalAvailableLiquidity = availableLiquidity + reassuranceFund;
    utilizationRatio = (ProtoUtilV1.MULTIPLIER * (commitment + amountToCover)) / totalAvailableLiquidity;

    rate = utilizationRatio > floor ? utilizationRatio : floor;

    rate = rate + (coverDuration * 100);

    if (rate > ceiling) {
      rate = ceiling;
    }

    uint256 expiryDate = CoverUtilV1.getExpiryDateInternal(block.timestamp, coverDuration); // solhint-disable-line
    uint256 daysCovered = BokkyPooBahsDateTimeLibrary.diffDays(block.timestamp, expiryDate); // solhint-disable-line

    fee = (amountToCover * rate * daysCovered) / (365 * ProtoUtilV1.MULTIPLIER);
  }

  function getPolicyFeeInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover
  ) public view returns (uint256 fee, uint256 platformFee) {
    (fee, , , , , ) = calculatePolicyFeeInternal(s, coverKey, productKey, coverDuration, amountToCover);

    uint256 rate = s.getUintByKey(ProtoUtilV1.NS_COVER_PLATFORM_FEE);
    platformFee = (fee * rate) / ProtoUtilV1.MULTIPLIER;
  }

  function _getCoverPoolAmounts(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  )
    private
    view
    returns (
      uint256 availableLiquidity,
      uint256 commitment,
      uint256 reassuranceFund
    )
  {
    uint256[] memory values = s.getCoverPoolSummaryInternal(coverKey, productKey);

    /*
     * values[0] stablecoinOwnedByVault --> The total amount in the cover pool
     * values[1] commitment --> The total commitment amount
     * values[2] reassurance
     * values[3] reassurancePoolWeight
     * values[4] count --> Count of products under this cover
     * values[5] leverage
     * values[6] efficiency --> Cover product efficiency weight
     */

    availableLiquidity = values[0];
    commitment = values[1];

    // (reassurance * reassurancePoolWeight) / multiplier
    reassuranceFund = (values[2] * values[3]) / ProtoUtilV1.MULTIPLIER;

    if (s.supportsProductsInternal(coverKey)) {
      require(values[4] > 0, "Misconfigured or retired product");

      // (stablecoinOwnedByVault * leverage * efficiency) / (count * multiplier)
      availableLiquidity = (values[0] * values[5] * values[6]) / (values[4] * ProtoUtilV1.MULTIPLIER);
    }
  }

  function getPolicyRatesInternal(IStore s, bytes32 coverKey) public view returns (uint256 floor, uint256 ceiling) {
    if (coverKey > 0) {
      floor = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, coverKey);
      ceiling = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, coverKey);
    }

    if (floor == 0) {
      // Fallback to default values
      floor = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR);
      ceiling = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING);
    }
  }

  function getCxTokenInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration
  ) public view returns (address cxToken, uint256 expiryDate) {
    expiryDate = CoverUtilV1.getExpiryDateInternal(block.timestamp, coverDuration); // solhint-disable-line
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, coverKey, productKey, expiryDate));

    cxToken = s.getAddress(k);
  }

  /**
   * @dev Gets the instance of cxToken or deploys a new one based on the cover expiry timestamp
   * @param coverKey Enter the cover key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function getCxTokenOrDeployInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration
  ) public returns (ICxToken) {
    (address cxToken, uint256 expiryDate) = getCxTokenInternal(s, coverKey, productKey, coverDuration);

    if (cxToken != address(0)) {
      return ICxToken(cxToken);
    }

    ICxTokenFactory factory = s.getCxTokenFactory();
    cxToken = factory.deploy(coverKey, productKey, _getCxTokenName(coverKey, productKey, expiryDate), expiryDate);

    // @warning: Do not uncomment the following line
    // Reason: cxTokens are no longer protocol members
    // as we will end up with way too many contracts
    // s.getProtocol().addMember(cxToken);
    return ICxToken(cxToken);
  }

  /**
   * @dev Returns month name of a given date
   */
  function _getMonthName(uint256 date) private pure returns (bytes3) {
    bytes3[13] memory m = [bytes3(0), "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    uint256 month = BokkyPooBahsDateTimeLibrary.getMonth(date);

    return m[month];
  }

  /**
   * @dev Returns cxToken name from the supplied inputs.
   *
   * Format:
   *
   * For basket cover pool product
   * --> cxusd:dex:uni:nov (cxUSD)
   *
   * For standalone cover pool
   * --> cxusd:bal:nov (cxUSD)
   */
  function _getCxTokenName(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 expiry
  ) private pure returns (string memory) {
    bytes3 month = _getMonthName(expiry);

    if (productKey > 0) {
      return string(abi.encodePacked("cxusd:", string(abi.encodePacked(coverKey)), ":", string(abi.encodePacked(productKey)), ":", string(abi.encodePacked(month))));
    }

    return string(abi.encodePacked("cxusd:", string(abi.encodePacked(coverKey)), ":", string(abi.encodePacked(month))));
  }

  /**
   *
   * @dev Purchase cover for the specified amount. <br /> <br />
   * When you purchase covers, you receive equal amount of cxTokens back.
   * You need the cxTokens to claim the cover when resolution occurs.
   * Each unit of cxTokens are fully redeemable at 1:1 ratio to the given
   * stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.
   *
   * @custom:suppress-malicious-erc The ERC-20 `stablecoin` can't be manipulated via user input.
   *
   * @param onBehalfOf Enter the address where the claim tokens (cxTokens) should be sent.
   * @param coverKey Enter the cover key you wish to purchase the policy for
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin to cover.
   *
   */
  function purchaseCoverInternal(
    IStore s,
    address onBehalfOf,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover
  )
    external
    returns (
      ICxToken cxToken,
      uint256 fee,
      uint256 platformFee
    )
  {
    (fee, platformFee) = getPolicyFeeInternal(s, coverKey, productKey, coverDuration, amountToCover);
    require(fee > 0, "Insufficient fee");
    require(platformFee > 0, "Insufficient platform fee");

    address stablecoin = s.getStablecoin();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    IERC20(stablecoin).ensureTransferFrom(msg.sender, address(this), fee);
    IERC20(stablecoin).ensureTransfer(s.getVaultAddress(coverKey), fee - platformFee);
    IERC20(stablecoin).ensureTransfer(s.getTreasury(), platformFee);

    uint256 stablecoinPrecision = s.getStablecoinPrecision();
    uint256 toMint = (amountToCover * ProtoUtilV1.CXTOKEN_PRECISION) / stablecoinPrecision;

    cxToken = getCxTokenOrDeployInternal(s, coverKey, productKey, coverDuration);
    cxToken.mint(coverKey, productKey, onBehalfOf, toMint);

    s.updateStateAndLiquidity(coverKey);
  }

  function getCoverageLagInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 custom = s.getUintByKeys(ProtoUtilV1.NS_COVERAGE_LAG, coverKey);

    // Custom means set for this exact cover
    if (custom > 0) {
      return custom;
    }

    // Global means set for all covers (without specifying a cover key)
    uint256 global = s.getUintByKey(ProtoUtilV1.NS_COVERAGE_LAG);

    if (global > 0) {
      return global;
    }

    // Fallback means the default option
    return COVER_LAG_FALLBACK_VALUE;
  }
}
