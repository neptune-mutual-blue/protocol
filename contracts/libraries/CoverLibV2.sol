// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../dependencies/BokkyPooBahsDateTimeLibrary.sol";
import "../interfaces/IStore.sol";
import "../interfaces/IVault.sol";
import "./CoverUtilV1.sol";
import "./ValidationLibV1.sol";

library CoverLibV2 {
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using RegistryLibV1 for IStore;

  function _getNextMonthEndDate(uint256 date, uint256 monthsToAdd) private pure returns (uint256) {
    uint256 futureDate = BokkyPooBahsDateTimeLibrary.addMonths(date, monthsToAdd);
    return _getMonthEndDate(futureDate);
  }

  function _getMonthEndDate(uint256 date) private pure returns (uint256) {
    // Get the year and month from the date
    (uint256 year, uint256 month, ) = BokkyPooBahsDateTimeLibrary.timestampToDate(date);

    // Count the total number of days of that month and year
    uint256 daysInMonth = BokkyPooBahsDateTimeLibrary._getDaysInMonth(year, month);

    // Get the month end date
    return BokkyPooBahsDateTimeLibrary.timestampFromDateTime(year, month, daysInMonth, 23, 59, 59);
  }

  /**
   * @dev Gets future commitment of a given cover product.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param excludedExpiryDate Enter expiry date (from current commitment) to exclude
   *
   * @return sum The total commitment amount.
   *
   */
  function getFutureCommitments(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 excludedExpiryDate
  ) internal view returns (uint256 sum) {
    for (uint256 i = 0; i <= ProtoUtilV1.MAX_POLICY_DURATION; i++) {
      uint256 expiryDate = _getNextMonthEndDate(block.timestamp, i); // solhint-disable-line

      if (expiryDate == excludedExpiryDate || expiryDate <= block.timestamp) {
        // solhint-disable-previous-line
        continue;
      }

      ICxToken cxToken = ICxToken(s.getCxTokenByExpiryDateInternal(coverKey, productKey, expiryDate));

      if (address(cxToken) != address(0)) {
        sum += cxToken.totalSupply();
      }
    }
  }

  /**
   * @dev Deletes a cover
   *
   * @param s Specify store instance
   *
   */
  function deleteCoverInternal(
    IStore s,
    bytes32 coverKey,
    uint256 liquidityThreshold
  ) internal {
    s.mustBeValidCoverKey(coverKey);

    require(coverKey > 0, "Invalid cover key");

    bool supportsProducts = s.supportsProductsInternal(coverKey);
    require(supportsProducts == false, "Invalid cover");

    uint256 future = getFutureCommitments(s, coverKey, bytes32(0), 0);
    require(future == 0, "Has active policies");

    uint256 productCount = s.countBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey);
    require(productCount == 0, "Has products");

    IVault vault = s.getVault(coverKey);
    uint256 balance = vault.getStablecoinBalanceOf();
    require(balance <= liquidityThreshold, "Has liquidity");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER, coverKey, false);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_SUPPORTS_PRODUCTS, coverKey, false);
    s.deleteAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, coverKey);
    s.setStringByKeys(ProtoUtilV1.NS_COVER_INFO, coverKey, "");
    s.deleteUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, coverKey);

    s.deleteUintByKeys(ProtoUtilV1.NS_COVER_CREATION_FEE_EARNING, coverKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_COVER_CREATION_DATE, coverKey);

    s.deleteBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_MIN_FIRST_STAKE, coverKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_PERIOD, coverKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_RESOLUTION_COOL_DOWN_PERIOD, coverKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, coverKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, coverKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_RATE, coverKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_COVER_LEVERAGE_FACTOR, coverKey);
  }

  /**
   * @dev Deletes a cover product.
   *
   */
  function deleteProductInternal(IStore s, bytes32 coverKey, bytes32 productKey) external {
    s.mustBeValidCoverKey(coverKey);
    s.mustSupportProducts(coverKey);
    s.mustBeValidProduct(coverKey, productKey);

    uint256 futureCommitments = getFutureCommitments(s, coverKey, productKey, 0);
    require(futureCommitments == 0, "Has active policies");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, false);
    s.setStringByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey, "");
    s.deleteBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey);
    s.setBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey, productKey, false);

    s.deleteUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey);
    s.deleteUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, coverKey, productKey);
  }
}
