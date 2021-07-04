// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/ICTokenFactory.sol";
import "../../interfaces/ICToken.sol";
import "../../interfaces/IPolicy.sol";
import "../../libraries/CoverUtilV1.sol";
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
  using NTransferUtilV2 for IERC20;

  constructor(IStore store) Recoverable(store) {
    this;
  }

  /**
   * @dev Purchase cover for the specified amount. <br /> <br />
   * When you purchase covers, you recieve equal amount of cTokens back.
   * You need the cTokens to claim the cover when resolution occurs.
   * Each unit of cTokens are fully redeemable at 1:1 ratio to the given
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
    require(coverDuration > 0 && coverDuration <= 3, "Invalid cover duration");

    (uint256 fee, , , , , , ) = _getCoverFee(key, coverDuration, amountToCover);
    ICToken cToken = _getCTokenOrDeploy(key, coverDuration);

    address liquidityToken = s.getLiquidityToken();
    require(liquidityToken != address(0), "Cover liquidity uninitialized");

    // Transfer the fee to cToken contract
    IERC20(liquidityToken).ensureTransferFrom(super._msgSender(), address(cToken), fee);

    cToken.mint(key, super._msgSender(), amountToCover);
    return address(cToken);
  }

  function getCToken(bytes32 key, uint256 coverDuration) public view returns (address cToken, uint256 expiryDate) {
    expiryDate = getExpiryDate(block.timestamp, coverDuration); // solhint-disable-line
    bytes32 k = abi.encodePacked(ProtoUtilV1.NS_COVER_CTOKEN, key, expiryDate).toKeccak256();

    cToken = s.getAddress(k);
  }

  /**
   * @dev Gets the instance of cToken or deploys a new one based on the cover expiry timestamp
   * @param key Enter the cover key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function _getCTokenOrDeploy(bytes32 key, uint256 coverDuration) private returns (ICToken) {
    (address cToken, uint256 expiryDate) = getCToken(key, coverDuration);

    if (cToken != address(0)) {
      return ICToken(cToken);
    }

    ICTokenFactory factory = s.getCTokenFactory();
    cToken = factory.deploy(s, key, expiryDate);
    return ICToken(cToken);
  }

  /**
   * @dev Gets the expiry date based on cover duration
   * @param today Enter the current timestamp
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function getExpiryDate(uint256 today, uint256 coverDuration) public override pure returns (uint256) {
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
    view override
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

    // TOTAL AVAILABLE LIQUIDITY = AMOUNT_IN_COVER_POOL - COVER_COMMITMENT + (NEP_REWARD_POOL_SUPPORT * NEP_PRICE) + (ASSURANCE_POOL_SUPPORT * ASSURANCE_TOKEN_PRICE * ASSURANCE_POOL_WEIGHT)
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
   * @param _values[2] The total amount of NEP provision
   * @param _values[3] NEP price
   * @param _values[4] The total amount of assurance tokens
   * @param _values[5] Assurance token price
   * @param _values[6] Assurance pool weight
   */
  function getCoverPoolSummary(bytes32 key) external override view returns (uint256[] memory _values) {
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
