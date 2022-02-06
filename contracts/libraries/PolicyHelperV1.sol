// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "./ProtoUtilV1.sol";
import "./CoverUtilV1.sol";
import "./ValidationLibV1.sol";
import "./RoutineInvokerLibV1.sol";
import "../interfaces/ICxToken.sol";
import "../interfaces/IStore.sol";

library PolicyHelperV1 {
  using ProtoUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using RegistryLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  /**
   * @dev Gets the cover fee info for the given cover key, duration, and amount
   * @param key Enter the cover key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin `liquidityToken` to cover.
   */
  function getCoverFeeInfoInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  )
    public
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
    (floor, ceiling) = getPolicyRatesInternal(s, key);
    uint256[] memory values = s.getCoverPoolSummaryInternal(key);

    require(coverDuration <= 3, "Invalid duration");
    require(floor > 0 && ceiling > floor, "Policy rate config error");

    // AMOUNT_IN_COVER_POOL - COVER_COMMITMENT > AMOUNT_TO_COVER
    require(values[0] - values[1] > amountToCover, "Insufficient fund");

    // UTILIZATION RATIO = COVER_COMMITMENT / AMOUNT_IN_COVER_POOL
    utilizationRatio = (ProtoUtilV1.MULTIPLIER * values[1]) / values[0];

    // TOTAL AVAILABLE LIQUIDITY = AMOUNT_IN_COVER_POOL - COVER_COMMITMENT + (NEP_REWARD_POOL_SUPPORT * NEP_PRICE) + (REASSURANCE_POOL_SUPPORT * REASSURANCE_TOKEN_PRICE * REASSURANCE_POOL_WEIGHT)
    totalAvailableLiquidity = values[0] - values[1] + ((values[2] * values[3]) / 1 ether) + ((values[4] * values[5] * values[6]) / (ProtoUtilV1.MULTIPLIER * 1 ether));

    // COVER RATIO = UTILIZATION_RATIO + COVER_DURATION * AMOUNT_TO_COVER / AVAILABLE_LIQUIDITY
    coverRatio = utilizationRatio + ((ProtoUtilV1.MULTIPLIER * coverDuration * amountToCover) / totalAvailableLiquidity);

    rate = _getCoverFeeRate(floor, ceiling, coverRatio);
    fee = (amountToCover * rate * coverDuration) / (12 * ProtoUtilV1.MULTIPLIER);
  }

  function getCoverFeeInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  ) public view returns (uint256 fee) {
    (fee, , , , , , ) = getCoverFeeInfoInternal(s, key, coverDuration, amountToCover);
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

  function getPolicyRatesInternal(IStore s, bytes32 key) public view returns (uint256 floor, uint256 ceiling) {
    floor = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR, key);
    ceiling = s.getUintByKeys(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING, key);

    if (floor == 0) {
      // Fallback to default values
      floor = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_FLOOR);
      ceiling = s.getUintByKey(ProtoUtilV1.NS_COVER_POLICY_RATE_CEILING);
    }
  }

  function getCxTokenInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration
  ) public view returns (address cxToken, uint256 expiryDate) {
    expiryDate = CoverUtilV1.getExpiryDateInternal(block.timestamp, coverDuration); // solhint-disable-line
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, key, expiryDate));

    cxToken = s.getAddress(k);
  }

  /**
   * @dev Gets the instance of cxToken or deploys a new one based on the cover expiry timestamp
   * @param key Enter the cover key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function getCxTokenOrDeployInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration
  ) public returns (ICxToken) {
    (address cxToken, uint256 expiryDate) = getCxTokenInternal(s, key, coverDuration);

    if (cxToken != address(0)) {
      return ICxToken(cxToken);
    }

    ICxTokenFactory factory = s.getCxTokenFactory();
    cxToken = factory.deploy(s, key, expiryDate);
    s.addMemberInternal(cxToken);

    return ICxToken(cxToken);
  }

  /**
   * @dev Purchase cover for the specified amount. <br /> <br />
   * When you purchase covers, you receive equal amount of cxTokens back.
   * You need the cxTokens to claim the cover when resolution occurs.
   * Each unit of cxTokens are fully redeemable at 1:1 ratio to the given
   * stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.
   * @param key Enter the cover key you wish to purchase the policy for
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin `liquidityToken` to cover.
   */
  function purchaseCoverInternal(
    IStore s,
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  ) external returns (ICxToken cxToken, uint256 fee) {
    fee = getCoverFeeInternal(s, key, coverDuration, amountToCover);
    cxToken = getCxTokenOrDeployInternal(s, key, coverDuration);

    address stablecoin = s.getStablecoin();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    _setCommitments(s, cxToken, amountToCover);

    // Transfer the fee to the vault
    IERC20(stablecoin).ensureTransferFrom(msg.sender, address(s.getVault(key)), fee);
    cxToken.mint(key, msg.sender, amountToCover);

    s.updateStateAndLiquidity(key);
  }

  function _setCommitments(
    IStore s,
    ICxToken cxToken,
    uint256 amountToCover
  ) private {
    uint256 expiryDate = cxToken.expiresOn();
    bytes32 coverKey = cxToken.coverKey();

    bytes32 k = CoverUtilV1.getCommitmentKey(coverKey, expiryDate);
    s.addUint(k, amountToCover);
  }

  /**
   * Gets the sum total of cover commitment that is still active
   */
  function getCommitmentInternal(IStore s, bytes32 key) external view returns (uint256) {
    // revert("Not implemented");
    // @todo: implementation needed
    return s.getCoverLiquidityCommitted(key);
  }

  /**
   * Gets the available liquidity in the pool.
   */
  function getCoverableInternal(
    IStore,
    bytes32 /*key*/
  ) external pure returns (uint256) {
    revert("Not implemented");
  }
}
