// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface IPolicy is IMember {
  
  struct PurchaseCoverArgs {
    address onBehalfOf; //onBehalfOf Enter an address you would like to send the claim tokens (cxTokens) to.
    bytes32 coverKey; //coverKey Enter the cover key you wish to purchase the policy for
    bytes32 productKey; //productKey Enter the product key you wish to purchase the policy for
    uint256 coverDuration; //coverDuration Enter the number of months to cover. Accepted values: 1-3.
    uint256 amountToCover; //amountToCover Enter the amount of the stablecoin to cover.
    bytes32 referralCode;
  }

  struct CoverFeeInfoType {
    uint256 fee;
    uint256 utilizationRatio;
    uint256 totalAvailableLiquidity;
    uint256 floor; //floor The lowest cover fee rate fallback
    uint256 ceiling; //ceiling The highest cover fee rate fallback
    uint256 rate;
  }

  struct CoverPoolSummaryType {
    uint256 totalAmountInPool; //totalAmountInPool The total amount in the cover pool
    uint256 totalCommitment; //totalCommitment The total commitment amount
    uint256 reassuranceAmount; //reassuranceAmount Reassurance amount
    uint256 reassurancePoolWeight; //reassurancePoolWeight Reassurance pool weight
    uint256 productCount; //productCount Count of products under this cover
    uint256 leverage; //leverage Leverage
    uint256 productCapitalEfficiency; //productCapitalEfficiency Cover product efficiency weight
  }

  event CoverPurchased(PurchaseCoverArgs args, address indexed cxToken, uint256 fee, uint256 platformFee, uint256 expiresOn, uint256 policyId);

  /**
   * @dev Purchase cover for the specified amount. <br /> <br />
   * When you purchase covers, you receive equal amount of cxTokens back.
   * You need the cxTokens to claim the cover when resolution occurs.
   * Each unit of cxTokens are fully redeemable at 1:1 ratio to the given
   * stablecoins (like wxDai, DAI, USDC, or BUSD) based on the chain.
   */

  function purchaseCover(PurchaseCoverArgs calldata args) external returns (address, uint256);

  /**
   * @dev Gets the cover fee info for the given cover key, duration, and amount
   * @param coverKey Enter the cover key
   * @param productKey Enter the product key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin to cover.
   */
  function getCoverFeeInfo(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration,
    uint256 amountToCover
  ) external view returns (CoverFeeInfoType memory);

  /**
   * @dev Returns pool summary of the given cover key
   */
  function getCoverPoolSummary(bytes32 coverKey, bytes32 productKey) external view returns (CoverPoolSummaryType memory summary);

  function getCxToken(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 coverDuration
  ) external view returns (address cxToken, uint256 expiryDate);

  function getCxTokenByExpiryDate(
    bytes32 coverKey,
    bytes32 productKey,
    uint256 expiryDate
  ) external view returns (address cxToken);

  /**
   * Gets the sum total of cover commitment that haven't expired yet.
   */
  function getCommitment(bytes32 coverKey, bytes32 productKey) external view returns (uint256);

  /**
   * Gets the available liquidity in the pool.
   */
  function getAvailableLiquidity(bytes32 coverKey) external view returns (uint256);

  /**
   * @dev Gets the expiry date based on cover duration
   * @param today Enter the current timestamp
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function getExpiryDate(uint256 today, uint256 coverDuration) external pure returns (uint256);
}
