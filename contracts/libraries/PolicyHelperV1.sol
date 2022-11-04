// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "../interfaces/ICxToken.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IERC20Detailed.sol";
import "./NTransferUtilV2.sol";
import "./RoutineInvokerLibV1.sol";

library PolicyHelperV1 {
  using CoverUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StoreKeyUtil for IStore;

  struct CalculatePolicyFeeArgs {
    bytes32 coverKey;
    bytes32 productKey;
    uint256 coverDuration;
    uint256 amountToCover;
  }

  function calculatePolicyFeeInternal(IStore s, CalculatePolicyFeeArgs memory args) public view returns (IPolicy.CoverFeeInfoType memory policyFee) {
    (policyFee.floor, policyFee.ceiling) = getPolicyRatesInternal(s, args.coverKey);
    (uint256 availableLiquidity, uint256 commitment, uint256 reassuranceFund) = _getCoverPoolAmounts(s, args.coverKey, args.productKey);

    require(args.amountToCover > 0, "Please enter an amount");
    require(args.coverDuration > 0 && args.coverDuration <= ProtoUtilV1.MAX_POLICY_DURATION, "Invalid duration");
    require(policyFee.floor > 0 && policyFee.ceiling > policyFee.floor, "Policy rate config error");

    require(availableLiquidity - commitment > args.amountToCover, "Insufficient fund");

    policyFee.totalAvailableLiquidity = availableLiquidity + reassuranceFund;
    policyFee.utilizationRatio = (ProtoUtilV1.MULTIPLIER * (commitment + args.amountToCover)) / policyFee.totalAvailableLiquidity;

    // console.log("[sc] s: %s, p: %s, u: %s", availableLiquidity, reassuranceFund, policyFee.utilizationRatio);
    // console.log("[sc] c: %s, a: %s, t: %s", commitment, args.amountToCover, policyFee.totalAvailableLiquidity);

    policyFee.rate = policyFee.utilizationRatio > policyFee.floor ? policyFee.utilizationRatio : policyFee.floor;

    policyFee.rate = policyFee.rate + (args.coverDuration * 100);

    if (policyFee.rate > policyFee.ceiling) {
      policyFee.rate = policyFee.ceiling;
    }

    uint256 expiryDate = CoverUtilV1.getExpiryDateInternal(block.timestamp, args.coverDuration); // solhint-disable-line
    uint256 effectiveFrom = getEODInternal(block.timestamp + s.getCoverageLagInternal(args.coverKey)); // solhint-disable-line
    uint256 daysCovered = BokkyPooBahsDateTimeLibrary.diffDays(effectiveFrom, expiryDate);

    policyFee.fee = (args.amountToCover * policyFee.rate * daysCovered) / (365 * ProtoUtilV1.MULTIPLIER);
  }

  function getPolicyFeeInternal(IStore s, CalculatePolicyFeeArgs memory args) public view returns (uint256 fee, uint256 platformFee) {
    IPolicy.CoverFeeInfoType memory coverFeeInfo = calculatePolicyFeeInternal(s, args);
    fee = coverFeeInfo.fee;

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
    IPolicy.CoverPoolSummaryType memory summary = s.getCoverPoolSummaryInternal(coverKey, productKey);

    availableLiquidity = summary.totalAmountInPool;
    commitment = summary.totalCommitment;

    reassuranceFund = (summary.reassuranceAmount * summary.reassurancePoolWeight) / ProtoUtilV1.MULTIPLIER;

    if (s.supportsProductsInternal(coverKey)) {
      require(summary.productCount > 0, "Misconfigured or retired product");
      availableLiquidity = (summary.totalAmountInPool * summary.leverage * summary.productCapitalEfficiency) / (summary.productCount * ProtoUtilV1.MULTIPLIER);
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
    string memory tokenName = _getCxTokenName(coverKey, productKey, expiryDate);

    cxToken = factory.deploy(coverKey, productKey, tokenName, expiryDate);

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
   * --> dex:uni:nov (cxUSD)
   *
   * For standalone cover pool
   * --> bal:nov (cxUSD)
   */
  function _getCxTokenName(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 expiry
  ) private pure returns (string memory) {
    bytes3 month = _getMonthName(expiry);

    if (productKey > 0) {
      return string(abi.encodePacked(string(abi.encodePacked(coverKey)), ":", string(abi.encodePacked(productKey)), ":", string(abi.encodePacked(month))));
    }

    return string(abi.encodePacked(string(abi.encodePacked(coverKey)), ":", string(abi.encodePacked(month))));
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
   */
  function purchaseCoverInternal(
    IStore s,
    uint256 policyId,
    IPolicy.PurchaseCoverArgs calldata args
  )
    external
    returns (
      ICxToken cxToken,
      uint256 fee,
      uint256 platformFee
    )
  {
    CalculatePolicyFeeArgs memory policyFeeArgs = CalculatePolicyFeeArgs({coverKey: args.coverKey, productKey: args.productKey, coverDuration: args.coverDuration, amountToCover: args.amountToCover});

    (fee, platformFee) = getPolicyFeeInternal(s, policyFeeArgs);
    require(fee > 0, "Insufficient fee");
    require(platformFee > 0, "Insufficient platform fee");

    address stablecoin = s.getStablecoinAddressInternal();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    IERC20(stablecoin).ensureTransferFrom(msg.sender, address(this), fee);
    IERC20(stablecoin).ensureTransfer(s.getVaultAddress(args.coverKey), fee - platformFee);
    IERC20(stablecoin).ensureTransfer(s.getTreasuryAddressInternal(), platformFee);

    uint256 stablecoinPrecision = s.getStablecoinPrecisionInternal();
    uint256 toMint = (args.amountToCover * ProtoUtilV1.CXTOKEN_PRECISION) / stablecoinPrecision;

    cxToken = getCxTokenOrDeployInternal(s, args.coverKey, args.productKey, args.coverDuration);
    cxToken.mint(policyId, args.coverKey, args.productKey, args.onBehalfOf, toMint);

    s.updateStateAndLiquidityInternal(args.coverKey);
  }

  /**
   * @dev Gets the EOD (End of Day) time
   */
  function getEODInternal(uint256 date) public pure returns (uint256) {
    (uint256 year, uint256 month, uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);
    return BokkyPooBahsDateTimeLibrary.timestampFromDateTime(year, month, day, 23, 59, 59);
  }

  /**
   * @dev Increases the "last policy id" and returns new id
   *
   */
  function incrementPolicyIdInternal(IStore s) external returns (uint256) {
    s.addUintByKey(ProtoUtilV1.NS_POLICY_LAST_PURCHASE_ID, 1);

    return s.getUintByKey(ProtoUtilV1.NS_POLICY_LAST_PURCHASE_ID);
  }
}
