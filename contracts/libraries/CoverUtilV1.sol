// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./ProtoUtilV1.sol";
import "./AccessControlLibV1.sol";
import "./BokkyPooBahsDateTimeLibrary.sol";
import "./StoreKeyUtil.sol";
import "./RegistryLibV1.sol";
import "./NTransferUtilV2.sol";
import "../interfaces/ICxToken.sol";

library CoverUtilV1 {
  using RegistryLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using AccessControlLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  enum CoverStatus {
    Normal,
    Stopped,
    IncidentHappened,
    FalseReporting,
    Claimable
  }

  function getCoverOwner(IStore s, bytes32 key) external view returns (address) {
    return _getCoverOwner(s, key);
  }

  function _getCoverOwner(IStore s, bytes32 key) private view returns (address) {
    return s.getAddressByKeys(ProtoUtilV1.NS_COVER_OWNER, key);
  }

  function getCoverFee(IStore s)
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

  function getMinCoverCreationStake(IStore s) public view returns (uint256) {
    uint256 value = s.getUintByKey(ProtoUtilV1.NS_COVER_CREATION_MIN_STAKE);

    if (value == 0) {
      // Fallback to 250 NPM
      value = 250 ether;
    }

    return value;
  }

  function getMinStakeToAddLiquidity(IStore s) public view returns (uint256) {
    uint256 value = s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_STAKE);

    if (value == 0) {
      // Fallback to 250 NPM
      value = 250 ether;
    }

    return value;
  }

  function getMinLiquidityPeriod(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_MIN_PERIOD);
  }

  function getClaimPeriod(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_CLAIM_PERIOD);
  }

  /**
   * @dev Returns the values of the given cover key
   * @param _values[0] The total amount in the cover pool
   * @param _values[1] The total commitment amount
   * @param _values[2] The total amount of NPM provision
   * @param _values[3] NPM price
   * @param _values[4] The total amount of reassurance tokens
   * @param _values[5] Reassurance token price
   * @param _values[6] Reassurance pool weight
   */
  function getCoverPoolSummaryInternal(IStore s, bytes32 key) external view returns (uint256[] memory _values) {
    IPriceDiscovery discovery = s.getPriceDiscoveryContract();

    _values = new uint256[](7);

    _values[0] = getCoverPoolLiquidity(s, key);
    _values[1] = getCoverLiquidityCommitted(s, key);
    _values[2] = s.getUintByKeys(ProtoUtilV1.NS_COVER_PROVISION, key);
    _values[3] = discovery.getTokenPriceInStableCoin(address(s.npmToken()), 1 ether);
    _values[4] = s.getUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE, key);
    _values[5] = discovery.getTokenPriceInStableCoin(address(s.getAddressByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_TOKEN, key)), 1 ether);
    _values[6] = s.getUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE_WEIGHT, key);
  }

  /**
   * @dev Gets the current status of a given cover
   *
   * 0 - normal
   * 1 - stopped, can not purchase covers or add liquidity
   * 2 - reporting, incident happened
   * 3 - reporting, false reporting
   * 4 - claimable, claims accepted for payout
   *
   */
  function getCoverStatus(IStore s, bytes32 key) external view returns (CoverStatus) {
    return CoverStatus(getStatus(s, key));
  }

  function getStatus(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STATUS, key);
  }

  function getCoverPoolLiquidity(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKey(getCoverLiquidityKey(key));
  }

  function getCoverLiquidityKey(bytes32 coverKey) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey));
  }

  function getCoverLiquidityAddedKey(bytes32 coverKey, address account) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_ADDED, coverKey, account));
  }

  function getCoverLiquidityReleaseDateKey(bytes32 coverKey, address account) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, account));
  }

  function getCoverLiquidityStakeKey(bytes32 coverKey) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_STAKE, coverKey));
  }

  function getCoverLiquidityStakeIndividualKey(bytes32 coverKey, address account) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_STAKE, coverKey, account));
  }

  function getCoverTotalLentKey(bytes32 coverKey) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_STABLECOIN_LENT_TOTAL, coverKey));
  }

  function getCommitmentKey(bytes32 coverKey, uint256 expiryDate) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_COMMITTED, coverKey, expiryDate));
  }

  function getCoverLiquidityCommitted(IStore s, bytes32 key) public view returns (uint256) {
    (uint256 reporting, uint256 active) = getCoverLiquidityCommitmentInfo(s, key);
    return reporting + active;
  }

  function getCoverLiquidityCommitmentInfo(IStore s, bytes32 key) public view returns (uint256 reporting, uint256 active) {
    reporting = getCommitmentsUnderReporting(s, key);
    active = getCurrentCommitments(s, key);
  }

  function getCommitmentsUnderReporting(IStore s, bytes32 key) public view returns (uint256) {
    uint256 incidentDateIfAny = getActiveIncidentDateInternal(s, key);

    // There isn't any incident for this cover
    // and therefore no need to pay
    if (incidentDateIfAny == 0) {
      return 0;
    }

    uint256 expiryDate = _getMonthEndDate(incidentDateIfAny);
    ICxToken cxToken = ICxToken(getCxTokenByExpiryDateInternal(s, key, expiryDate));

    if (address(cxToken) != address(0)) {
      return cxToken.totalSupply();
    }

    return 0;
  }

  function getCurrentCommitments(IStore s, bytes32 key) public view returns (uint256 sum) {
    uint256 maxMonthsToProtect = 3;

    for (uint256 i = 0; i < maxMonthsToProtect; i++) {
      uint256 expiryDate = _getNextMonthEndDate(block.timestamp, i); // solhint-disable-line
      ICxToken cxToken = ICxToken(getCxTokenByExpiryDateInternal(s, key, expiryDate));

      if (address(cxToken) != address(0)) {
        sum += cxToken.totalSupply();
      }
    }
  }

  function getStake(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STAKE, key);
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
  function setStatus(
    IStore s,
    bytes32 key,
    CoverStatus status
  ) external {
    s.setUintByKeys(ProtoUtilV1.NS_COVER_STATUS, key, uint256(status));
  }

  /**
   * @dev Gets the reassurance amount of the specified cover contract
   * @param key Enter the cover key
   */
  function getReassuranceAmountInternal(IStore s, bytes32 key) external view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_REASSURANCE, key);
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

  function getActiveIncidentDateInternal(IStore s, bytes32 key) public view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_GOVERNANCE_REPORTING_INCIDENT_DATE, key);
  }

  function getCxTokenByExpiryDateInternal(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) public view returns (address cxToken) {
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, key, expiryDate));
    cxToken = s.getAddress(k);
  }
}
