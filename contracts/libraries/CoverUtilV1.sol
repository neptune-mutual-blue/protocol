// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../dependencies/BokkyPooBahsDateTimeLibrary.sol";
import "../interfaces/IStore.sol";
import "./ProtoUtilV1.sol";
import "./AccessControlLibV1.sol";
import "./StoreKeyUtil.sol";
import "./RegistryLibV1.sol";
import "./StrategyLibV1.sol";
import "../interfaces/ICxToken.sol";
import "../interfaces/IERC20Detailed.sol";

library CoverUtilV1 {
  using RegistryLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using AccessControlLibV1 for IStore;
  using StrategyLibV1 for IStore;

  uint256 public constant REASSURANCE_WEIGHT_FALLBACK_VALUE = 8000;

  enum ProductStatus {
    Normal,
    Stopped,
    IncidentHappened,
    FalseReporting,
    Claimable
  }

  /**
   * @dev Returns the given cover's owner.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   *
   */
  function getCoverOwner(IStore s, bytes32 coverKey) external view returns (address) {
    return s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, coverKey);
  }

  /**
   * @dev Returns cover creation fee information.
   * @param s Specify store instance
   *
   * @return fee Returns the amount of NPM tokens you need to pay to create a new cover
   * @return minCoverCreationStake Returns the amount of NPM tokens you need to stake to create a new cover
   * @return minStakeToAddLiquidity Returns the amount of NPM tokens you need to stake to add liquidity
   *
   */
  function getCoverCreationFeeInfo(IStore s)
    external
    view
    returns (
      uint256 fee,
      uint256 minCoverCreationStake,
      uint256 minStakeToAddLiquidity
    )
  {
    fee = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_FEE);
    minCoverCreationStake = getMinCoverCreationStake(s);
    minStakeToAddLiquidity = getMinStakeToAddLiquidity(s);
  }

  /**
   * @dev Returns minimum NPM stake to create a new cover.
   * @param s Specify store instance
   */
  function getMinCoverCreationStake(IStore s) public view returns (uint256) {
    uint256 value = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE);

    if (value == 0) {
      // Fallback to 250 NPM
      value = 250 ether;
    }

    return value;
  }

  /**
   * @dev Returns a cover's creation date
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   *
   */
  function getCoverCreationDate(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_CREATION_DATE, coverKey);
  }

  /**
   * @dev Returns minimum NPM stake to add liquidity.
   * @param s Specify store instance
   */
  function getMinStakeToAddLiquidity(IStore s) public view returns (uint256) {
    uint256 value = s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE);

    if (value == 0) {
      // Fallback to 250 NPM
      value = 250 ether;
    }

    return value;
  }

  /**
   * @dev Gets claim period/duration of the given cover.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   *
   */
  function getClaimPeriod(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 fromKey = s.getUintByKeys(ProtoUtilV1.NS_CLAIM_PERIOD, coverKey);
    uint256 fallbackValue = s.getUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD);

    return fromKey > 0 ? fromKey : fallbackValue;
  }

  /**
   * @dev Returns a summary of the given cover pool.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param _values[0] The total amount in the cover pool
   * @param _values[1] The total commitment amount
   * @param _values[2] Reassurance amount
   * @param _values[3] Reassurance pool weight
   * @param _values[4] Count of products under this cover
   * @param _values[5] Leverage
   * @param _values[6] Cover product efficiency weight
   */
  function getCoverPoolSummaryInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (uint256[] memory _values) {
    _values = new uint256[](8);

    uint256 precision = s.getStablecoinPrecision();

    _values[0] = s.getStablecoinOwnedByVaultInternal(coverKey); // precision: stablecoin
    _values[1] = getActiveLiquidityUnderProtection(s, coverKey, productKey, precision); // <-- adjusted precision
    _values[2] = getReassuranceAmountInternal(s, coverKey); // precision: stablecoin
    _values[3] = getReassuranceWeightInternal(s, coverKey);
    _values[4] = s.countBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey);
    _values[5] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LEVERAGE_FACTOR, coverKey);
    _values[6] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT_EFFICIENCY, coverKey, productKey);
  }

  /**
   * @dev Gets the reassurance weight of a given cover key.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param s Provide store instance
   * @param coverKey Enter the cover for which you want to obtain the reassurance weight for.
   *
   * @return If reassurance weight value wasn't set for the specified cover pool,
   * the global value will be returned.
   *
   * If global value, too, isn't available, a fallback value of `REASSURANCE_WEIGHT_FALLBACK_VALUE`
   * is returned.
   *
   */
  function getReassuranceWeightInternal(IStore s, bytes32 coverKey) public view returns (uint256) {
    uint256 setForTheCoverPool = s.getUintByKey(getReassuranceWeightKey(coverKey));

    if (setForTheCoverPool > 0) {
      return setForTheCoverPool;
    }

    // Globally set value: not set for any specifical cover
    uint256 setGlobally = s.getUintByKey(getReassuranceWeightKey(0));

    if (setGlobally > 0) {
      return setGlobally;
    }

    return REASSURANCE_WEIGHT_FALLBACK_VALUE;
  }

  /**
   * @dev Gets the reassurance amount of the specified cover contract
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter the cover key
   *
   */
  function getReassuranceAmountInternal(IStore s, bytes32 coverKey) public view returns (uint256) {
    return s.getUintByKey(getReassuranceKey(coverKey));
  }

  /**
   * @dev Returns reassurance rate of the specified cover key.
   * When a cover is finalized after claims payout, a portion
   * of the reassurance fund (if available) is transferred to the cover liquidity pool.
   *
   * If the reassurance rate is 25%, either 25% of the reassurance pool
   * or 25% of the suffered loss is transferred prior to finalization, whichever is less.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param s Specify store
   * @param coverKey Enter cover key
   *
   */
  function getReassuranceRateInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    uint256 rate = s.getUintByKey(getReassuranceRateKey(coverKey));

    if (rate > 0) {
      return rate;
    }

    // Default: 25%
    return 2500;
  }

  /**
   * @dev Hash key of the reassurance for the given cover.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter cover key
   *
   */
  function getReassuranceKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_REASSURANCE, coverKey));
  }

  /**
   * @dev Hash key of the reassurance rate for the given cover.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter cover key
   *
   */
  function getReassuranceRateKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_REASSURANCE_RATE, coverKey));
  }

  /**
   * @dev Hash key of the reassurance weight for the given cover.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter cover key
   *
   */
  function getReassuranceWeightKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, coverKey));
  }

  /**
   * @dev Indicates whether the specified cover and all associated products are "normal".
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @return Returns false if any associated product isn't normal.
   *
   */
  function isCoverNormalInternal(IStore s, bytes32 coverKey) external view returns (bool) {
    uint256 incidentDate;

    bool supportsProducts = supportsProductsInternal(s, coverKey);

    if (supportsProducts == false) {
      incidentDate = getActiveIncidentDateInternal(s, coverKey, ProtoUtilV1.PRODUCT_KEY_INTENTIONALLY_EMPTY);
      return getProductStatusOfInternal(s, coverKey, ProtoUtilV1.PRODUCT_KEY_INTENTIONALLY_EMPTY, incidentDate) == ProductStatus.Normal;
    }

    bytes32[] memory products = _getProducts(s, coverKey);

    for (uint256 i = 0; i < products.length; i++) {
      incidentDate = getActiveIncidentDateInternal(s, coverKey, products[i]);
      bool isNormal = getProductStatusOfInternal(s, coverKey, products[i], incidentDate) == ProductStatus.Normal;

      if (!isNormal) {
        return false;
      }
    }

    return true;
  }

  /**
   * @dev Gets product status of the given cover product.
   *
   *
   * 0 - normal
   * 1 - stopped, can not purchase covers or add liquidity
   * 2 - reporting, incident happened
   * 3 - reporting, false reporting
   * 4 - claimable, claims accepted for payout
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function getProductStatusInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view returns (ProductStatus) {
    uint256 incidentDate = getActiveIncidentDateInternal(s, coverKey, productKey);
    return getProductStatusOfInternal(s, coverKey, productKey, incidentDate);
  }

  /**
   * @dev Returns current status a given cover product as `ProductStatus`.
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function getProductStatusOfInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public view returns (ProductStatus) {
    uint256 value = s.getUintByKey(getProductStatusOfKey(coverKey, productKey, incidentDate));
    return ProductStatus(value);
  }

  /**
   * @dev Hash key of the product status of (the given cover, product, and incident date)
   * for historical significance. This must not be reset during finalization.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter incident date
   *
   */
  function getProductStatusOfKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_STATUS, coverKey, productKey, incidentDate));
  }

  /**
   * @dev Hash key of the stakes (collectively added by liquidity providers) of the given cover.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter cover key
   *
   */
  function getCoverLiquidityStakeKey(bytes32 coverKey) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_STAKE, coverKey));
  }

  /**
   * @dev Hash key of the last stablecoin deposit of the given cover.
   * There must be a couple of block heights as an offset
   * before withdrawal can be performed (even during a withdrawal window).
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter cover key
   *
   */
  function getLastDepositHeightKey(bytes32 coverKey) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_DEPOSIT_HEIGHTS, coverKey));
  }

  /**
   * @dev Hash key of the individual stake (added by an LP) for the given cover and account.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param account Enter the account to obtain the hash key
   *
   */
  function getCoverLiquidityStakeIndividualKey(bytes32 coverKey, address account) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_STAKE, coverKey, account));
  }

  /**
   * @dev Hash key of the blacklisted accounts for the given cover.
   * Blacklisted accounts are forbidden to receive claims payout.
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param incidentDate Enter the trigger incident date
   *
   */
  function getBlacklistKey(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate
  ) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CLAIM_BLACKLIST, coverKey, productKey, incidentDate));
  }

  /**
   * @dev Returns the total liquidity commited/under active protection.
   * If the cover is a diversified pool, returns sum total of all products' commitments.
   *
   * Simply put, commitments are the "totalSupply" of cxTokens that haven't yet expired.
   * Note that cxTokens can be precise to 18 decimal places.
   * If the protocol's stablecoin has a different precision,
   * you must tell this function explicitly when you call it.
   *
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param precision Specify the protocol stablecoin precision.
   *
   */
  function getTotalLiquidityUnderProtection(
    IStore s,
    bytes32 coverKey,
    uint256 precision
  ) external view returns (uint256 total) {
    bool supportsProducts = supportsProductsInternal(s, coverKey);

    if (supportsProducts == false) {
      return getActiveLiquidityUnderProtection(s, coverKey, ProtoUtilV1.PRODUCT_KEY_INTENTIONALLY_EMPTY, precision);
    }

    bytes32[] memory products = _getProducts(s, coverKey);

    for (uint256 i = 0; i < products.length; i++) {
      total += getActiveLiquidityUnderProtection(s, coverKey, products[i], precision);
    }
  }

  function _getProducts(IStore s, bytes32 coverKey) private view returns (bytes32[] memory products) {
    return s.getBytes32ArrayByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey);
  }

  /**
   * @dev Returns the total liquidity commited/under active protection.
   * If the cover is a diversified pool, you must a provide product key.
   *
   * Simply put, commitments are the "totalSupply" of cxTokens that haven't yet expired.
   * Note that cxTokens are precise to 18 decimal places.
   * If the protocol's stablecoin has a different precision,
   * you must tell this function explicitly when you call it.
   *
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param adjustPrecision Specify the protocol stablecoin precision.
   *
   */
  function getActiveLiquidityUnderProtection(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 adjustPrecision
  ) public view returns (uint256 total) {
    (uint256 current, uint256 expiryDate) = _getCurrentCommitment(s, coverKey, productKey);
    uint256 future = _getFutureCommitments(s, coverKey, productKey, expiryDate);

    total = current + future;

    // @caution:
    // Adjusting precision results in truncation and data loss.
    //
    // Can also open a can of worms if the protocol stablecoin
    // address needs to be updated in the future.
    total = (total * adjustPrecision) / ProtoUtilV1.CXTOKEN_PRECISION;
  }

  /**
   * @dev Gets current commitment of a given cover product.
   *
   * <br /> <br />
   *
   * If there is no incident, should return zero.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   * @return amount The current commitment amount.
   * @return expiryDate The time at which the commitment `amount` expires.
   *
   */
  function _getCurrentCommitment(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) private view returns (uint256 amount, uint256 expiryDate) {
    uint256 incidentDateIfAny = getActiveIncidentDateInternal(s, coverKey, productKey);

    // There isn't any incident for this cover
    // and therefore no need to pay
    if (incidentDateIfAny == 0) {
      return (0, 0);
    }

    expiryDate = _getMonthEndDate(incidentDateIfAny);
    ICxToken cxToken = ICxToken(getCxTokenByExpiryDateInternal(s, coverKey, productKey, expiryDate));

    if (address(cxToken) != address(0)) {
      amount = cxToken.totalSupply();
    }
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
  function _getFutureCommitments(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 excludedExpiryDate
  ) private view returns (uint256 sum) {
    uint256 maxMonthsToProtect = 3;

    for (uint256 i = 0; i < maxMonthsToProtect; i++) {
      uint256 expiryDate = _getNextMonthEndDate(block.timestamp, i); // solhint-disable-line

      if (expiryDate == excludedExpiryDate || expiryDate <= block.timestamp) {
        // solhint-disable-previous-line
        continue;
      }

      ICxToken cxToken = ICxToken(getCxTokenByExpiryDateInternal(s, coverKey, productKey, expiryDate));

      if (address(cxToken) != address(0)) {
        sum += cxToken.totalSupply();
      }
    }
  }

  /**
   * @dev Gets the total amount of NPM stakes added for the specified cover.
   *
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   */
  function getStake(IStore s, bytes32 coverKey) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, coverKey);
  }

  /**
   * @dev Sets the current status of a given cover
   *
   * 0 - normal
   * 1 - stopped, can not purchase covers or add liquidity
   * 2 - reporting, incident happened
   * 3 - reporting, false reporting
   * 4 - claimable, claims accepted for payout
   *
   */
  function setStatusInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 incidentDate,
    ProductStatus status
  ) external {
    s.setUintByKey(getProductStatusOfKey(coverKey, productKey, incidentDate), uint256(status));
  }

  /**
   * @dev Gets the expiry date based on cover duration
   * @param today Enter the current timestamp
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function getExpiryDateInternal(uint256 today, uint256 coverDuration) external pure returns (uint256) {
    // Get the day of the month
    (, , uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(today);

    // Cover duration of 1 month means current month
    // unless today is the 25th calendar day or later
    uint256 monthToAdd = coverDuration - 1;

    if (day >= 25) {
      // Add one month
      monthToAdd += 1;
    }

    return _getNextMonthEndDate(today, monthToAdd);
  }

  // function _getPreviousMonthEndDate(uint256 date, uint256 monthsToSubtract) private pure returns (uint256) {
  //   uint256 pastDate = BokkyPooBahsDateTimeLibrary.subMonths(date, monthsToSubtract);
  //   return _getMonthEndDate(pastDate);
  // }

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
   * @dev Returns the given cover product's cxToken by its expiry date (if available).
   *
   * Warning: this function does not validate the input arguments.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   * @param expiryDate Enter cxToken's expiry date
   *
   */
  function getCxTokenByExpiryDateInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    uint256 expiryDate
  ) public view returns (address cxToken) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, coverKey, productKey, expiryDate));
    cxToken = s.getAddress(k);
  }

  function checkIfProductRequiresWhitelist(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey, productKey);
  }

  function checkIfRequiresWhitelist(IStore s, bytes32 coverKey) external view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_COVER_REQUIRES_WHITELIST, coverKey);
  }

  function supportsProductsInternal(IStore s, bytes32 coverKey) public view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_COVER_SUPPORTS_PRODUCTS, coverKey);
  }

  function isValidProductInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (bool) {
    return s.getBoolByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey);
  }

  function isActiveProductInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (bool) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_PRODUCT, coverKey, productKey) == 1;
  }

  function disablePolicyInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey,
    bool status
  ) external {
    bytes32 key = getPolicyDisabledKey(coverKey, productKey);
    s.setBoolByKey(key, status);
  }

  function isPolicyDisabledInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) external view returns (bool) {
    bytes32 key = getPolicyDisabledKey(coverKey, productKey);
    return s.getBoolByKey(key);
  }

  /**
   * @dev Hash key of the "disabled policy flag" for the given cover product.
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   *
   */
  function getPolicyDisabledKey(bytes32 coverKey, bytes32 productKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_POLICY_DISABLED, coverKey, productKey));
  }

  /**
   * @dev Gets the latest and "active" incident date of a cover product.
   * Note that after "resolve" is invoked, incident date is reset.
   *
   * Warning: this function does not validate the cover and product key supplied.
   *
   * @param s Specify store instance
   * @param coverKey Enter cover key
   * @param productKey Enter product key
   */
  function getActiveIncidentDateInternal(
    IStore s,
    bytes32 coverKey,
    bytes32 productKey
  ) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, coverKey, productKey);
  }
}
