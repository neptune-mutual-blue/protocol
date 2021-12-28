// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/ICxTokenFactory.sol";
import "../../interfaces/ICxToken.sol";
import "../../interfaces/IPolicy.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/RegistryLibV1.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/BokkyPooBahsDateTimeLibrary.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

/**
 * @title Policy Contract
 * @dev The policy contract enables you to a purchase cover
 */
contract Policy is IPolicy, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ValidationLibV1 for IStore;

  constructor(IStore store) Recoverable(store) {
    this;
  }

  /**
   * @dev Purchase cover for the specified amount. <br /> <br />
   * When you purchase covers, you recieve equal amount of cxTokens back.
   * You need the cxTokens to claim the cover when resolution occurs.
   * Each unit of cxTokens are fully redeemable at 1:1 ratio to the given
   * stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.
   * @param key Enter the cover key you wish to purchase the policy for
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin `liquidityToken` to cover.
   */
  function purchaseCover(
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  ) external override nonReentrant returns (address) {
    s.mustNotBePaused();
    require(coverDuration > 0 && coverDuration <= 3, "Invalid cover duration");

    (uint256 fee, , , , , , ) = _getCoverFee(key, coverDuration, amountToCover);
    ICxToken cxToken = _getCxTokenOrDeploy(key, coverDuration);

    address liquidityToken = s.getLiquidityToken();
    require(liquidityToken != address(0), "Cover liquidity uninitialized");

    // Transfer the fee to cxToken contract
    // Todo: keep track of cover fee paid (for refunds)
    IERC20(liquidityToken).ensureTransferFrom(msg.sender, address(s.getVault(key)), fee);

    cxToken.mint(key, msg.sender, amountToCover);

    emit CoverPurchased(key, msg.sender, address(cxToken), fee, amountToCover, cxToken.expiresOn());
    return address(cxToken);
  }

  function getCxToken(bytes32 key, uint256 coverDuration) public view override returns (address cxToken, uint256 expiryDate) {
    expiryDate = getExpiryDate(block.timestamp, coverDuration); // solhint-disable-line
    bytes32 k = abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, key, expiryDate).toKeccak256();

    cxToken = s.getAddress(k);
  }

  function getCxTokenByExpiryDate(bytes32 key, uint256 expiryDate) external view override returns (address cxToken) {
    bytes32 k = abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, key, expiryDate).toKeccak256();

    cxToken = s.getAddress(k);
  }

  /**
   * @dev Gets the instance of cxToken or deploys a new one based on the cover expiry timestamp
   * @param key Enter the cover key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function _getCxTokenOrDeploy(bytes32 key, uint256 coverDuration) private returns (ICxToken) {
    (address cxToken, uint256 expiryDate) = getCxToken(key, coverDuration);

    if (cxToken != address(0)) {
      return ICxToken(cxToken);
    }

    ICxTokenFactory factory = s.getCxTokenFactory();
    cxToken = factory.deploy(s, key, expiryDate);
    s.addMember(cxToken);

    return ICxToken(cxToken);
  }

  /**
   * @dev Gets the expiry date based on cover duration
   * @param today Enter the current timestamp
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function getExpiryDate(uint256 today, uint256 coverDuration) public pure override returns (uint256) {
    // Get the day of the month
    (, , uint256 day) = BokkyPooBahsDateTimeLibrary.timestampToDate(today);

    // Cover duration of 1 month means current month
    // unless today is the 25th calendar day or later
    uint256 monthToAdd = coverDuration - 1;

    if (day >= 25) {
      // Add one month if today is the 25th calendar day or more
      monthToAdd += 1;
    }

    // Add the number of months to reach to any future date in that month
    uint256 futureDate = BokkyPooBahsDateTimeLibrary.addMonths(today, monthToAdd);

    // Only get the year and month from the future date
    (uint256 year, uint256 month, ) = BokkyPooBahsDateTimeLibrary.timestampToDate(futureDate);

    // Obtain the number of days for the given month and year
    uint256 daysInMonth = BokkyPooBahsDateTimeLibrary._getDaysInMonth(year, month);

    // Get the month end date
    return BokkyPooBahsDateTimeLibrary.timestampFromDateTime(year, month, daysInMonth, 23, 59, 59);
  }

  /**
   * Gets the sum total of cover commitment that haven't expired yet.
   */
  function getCommitment(
    bytes32 /*key*/
  ) external view override returns (uint256) {
    this;
    revert("Not implemented");
  }

  /**
   * Gets the available liquidity in the pool.
   */
  function getCoverable(
    bytes32 /*key*/
  ) external view override returns (uint256) {
    this;
    revert("Not implemented");
  }

  /**
   * @dev Gets the harmonic mean rate of the given ratios. Stops/truncates at min/max values.
   * @param floor The lowest cover fee rate
   * @param ceiling The highest cover fee rate
   * @param coverRatio Enter the ratio of the cover vs liquidity
   */
  function _getCoverFeeRate(
    uint256 floor,
    uint256 ceiling,
    uint256 coverRatio
  ) private pure returns (uint256) {
    // COVER FEE RATE = HARMEAN(FLOOR, COVER RATIO, CEILING)
    uint256 rate = getHarmonicMean(floor, coverRatio, ceiling);

    if (rate < floor) {
      return floor;
    }

    if (rate > ceiling) {
      return ceiling;
    }

    return rate;
  }

  /**
   * @dev Gets the cover fee info for the given cover key, duration, and amount
   * @param key Enter the cover key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin `liquidityToken` to cover.
   */
  function getCoverFee(
    bytes32 key,
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
      uint256 coverRatio,
      uint256 floor,
      uint256 ceiling,
      uint256 rate
    )
  {
    return _getCoverFee(key, coverDuration, amountToCover);
  }

  /**
   * @dev Gets the cover fee info for the given cover key, duration, and amount
   * @param key Enter the cover key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin `liquidityToken` to cover.
   */
  function _getCoverFee(
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  )
    private
    view
    returns (
      uint256 fee,
      uint256 utilizationRatio,
      uint256 totalAvailableLiquidity,
      uint256 coverRatio,
      uint256 floor,
      uint256 ceiling,
      uint256 rate
    )
  {
    require(coverDuration <= 3, "Invalid duration");

    (floor, ceiling) = s.getPolicyRates(key);

    require(floor > 0 && ceiling > floor, "Policy rate config error");

    uint256[] memory values = s.getCoverPoolSummary(key);

    // AMOUNT_IN_COVER_POOL - COVER_COMMITMENT > AMOUNT_TO_COVER
    require(values[0] - values[1] > amountToCover, "Insufficient fund");

    // UTILIZATION RATIO = COVER_COMMITMENT / AMOUNT_IN_COVER_POOL
    utilizationRatio = (1 ether * values[1]) / values[0];

    // TOTAL AVAILABLE LIQUIDITY = AMOUNT_IN_COVER_POOL - COVER_COMMITMENT + (NEP_REWARD_POOL_SUPPORT * NEP_PRICE) + (REASSURANCE_POOL_SUPPORT * REASSURANCE_TOKEN_PRICE * REASSURANCE_POOL_WEIGHT)
    totalAvailableLiquidity = values[0] - values[1] + ((values[2] * values[3]) / 1 ether) + ((values[4] * values[5] * values[6]) / (1 ether * 1 ether));

    // COVER RATIO = UTILIZATION_RATIO + COVER_DURATION * AMOUNT_TO_COVER / AVAILABLE_LIQUIDITY
    coverRatio = utilizationRatio + ((1 ether * coverDuration * amountToCover) / totalAvailableLiquidity);

    rate = _getCoverFeeRate(floor, ceiling, coverRatio);
    fee = (amountToCover * rate * coverDuration) / (12 ether);
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
  function getCoverPoolSummary(bytes32 key) external view override returns (uint256[] memory _values) {
    return s.getCoverPoolSummary(key);
  }

  /**
   * @dev Returns the harmonic mean of the supplied values.
   */
  function getHarmonicMean(
    uint256 x,
    uint256 y,
    uint256 z
  ) public pure returns (uint256) {
    require(x > 0 && y > 0 && z > 0, "Invalid arg");
    return 3e36 / ((1e36 / (x)) + (1e36 / (y)) + (1e36 / (z)));
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
  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_POLICY;
  }
}
