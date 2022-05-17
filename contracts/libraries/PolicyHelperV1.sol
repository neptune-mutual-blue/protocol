// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "./ProtoUtilV1.sol";
import "./CoverUtilV1.sol";
import "./ValidationLibV1.sol";
import "./RoutineInvokerLibV1.sol";
import "../interfaces/ICxToken.sol";
import "../interfaces/IStore.sol";
import "hardhat/console.sol";

library PolicyHelperV1 {
  using ProtoUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using RegistryLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  function calculatePolicyFeeInternal(
    IStore s,
    bytes32 coverKey,
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
    (uint256 stablecoinOwnedByVault, uint256 commitment, uint256 supportPool) = _getCoverPoolAmounts(s, coverKey);

    require(amountToCover > 0, "Please enter an amount");
    require(coverDuration > 0 && coverDuration <= 3, "Invalid duration");
    require(floor > 0 && ceiling > floor, "Policy rate config error");

    require(stablecoinOwnedByVault - commitment > amountToCover, "Insufficient fund");

    totalAvailableLiquidity = stablecoinOwnedByVault + supportPool;
    utilizationRatio = (ProtoUtilV1.MULTIPLIER * (commitment + amountToCover)) / totalAvailableLiquidity;

    console.log("[cp] s: %s. p: %s. u: %s", stablecoinOwnedByVault, supportPool, utilizationRatio);
    console.log("[cp]: %s, a: %s. t: %s", commitment, amountToCover, totalAvailableLiquidity);

    rate = utilizationRatio > floor ? utilizationRatio : floor;

    rate = rate + (coverDuration * 100);

    if (rate > ceiling) {
      rate = ceiling;
    }

    fee = (amountToCover * rate * coverDuration) / (12 * ProtoUtilV1.MULTIPLIER);
  }

  function _getCoverPoolAmounts(IStore s, bytes32 coverKey)
    private
    view
    returns (
      uint256 stablecoinOwnedByVault,
      uint256 commitment,
      uint256 supportPool
    )
  {
    uint256[] memory values = s.getCoverPoolSummaryInternal(coverKey);

    stablecoinOwnedByVault = values[0];
    commitment = values[1];

    uint256 reassuranceTokens = values[2];
    uint256 reassuranceTokenPrice = values[3];
    uint256 reassurancePoolWeight = values[4];

    uint256 reassurance = (reassuranceTokens * reassuranceTokenPrice) / 1 ether;
    supportPool = (reassurance * reassurancePoolWeight) / ProtoUtilV1.MULTIPLIER;
  }

  function getPolicyFeeInternal(
    IStore s,
    bytes32 coverKey,
    uint256 coverDuration,
    uint256 amountToCover
  ) public view returns (uint256 fee) {
    (fee, , , , , ) = calculatePolicyFeeInternal(s, coverKey, coverDuration, amountToCover);
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
    uint256 coverDuration
  ) public view returns (address cxToken, uint256 expiryDate) {
    expiryDate = CoverUtilV1.getExpiryDateInternal(block.timestamp, coverDuration); // solhint-disable-line
    bytes32 k = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, coverKey, expiryDate));

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
    uint256 coverDuration
  ) public returns (ICxToken) {
    (address cxToken, uint256 expiryDate) = getCxTokenInternal(s, coverKey, coverDuration);

    if (cxToken != address(0)) {
      return ICxToken(cxToken);
    }

    ICxTokenFactory factory = s.getCxTokenFactory();
    cxToken = factory.deploy(coverKey, expiryDate);

    // @note: cxTokens are no longer protocol members
    // as we will end up with way too many contracts
    // s.getProtocol().addMember(cxToken);
    return ICxToken(cxToken);
  }

  /**
   * @dev Purchase cover for the specified amount. <br /> <br />
   * When you purchase covers, you receive equal amount of cxTokens back.
   * You need the cxTokens to claim the cover when resolution occurs.
   * Each unit of cxTokens are fully redeemable at 1:1 ratio to the given
   * stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.
   * @param coverKey Enter the cover key you wish to purchase the policy for
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin `liquidityToken` to cover.
   */
  function purchaseCoverInternal(
    IStore s,
    bytes32 coverKey,
    uint256 coverDuration,
    uint256 amountToCover
  ) external returns (ICxToken cxToken, uint256 fee) {
    fee = getPolicyFeeInternal(s, coverKey, coverDuration, amountToCover);
    cxToken = getCxTokenOrDeployInternal(s, coverKey, coverDuration);

    address stablecoin = s.getStablecoin();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    // @suppress-malicious-erc20 `stablecoin` can't be manipulated via user input.
    IERC20(stablecoin).ensureTransferFrom(msg.sender, address(s.getVault(coverKey)), fee);
    cxToken.mint(coverKey, msg.sender, amountToCover);

    s.updateStateAndLiquidity(coverKey);
  }
}
