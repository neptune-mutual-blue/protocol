// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IMember.sol";

interface IPolicy is IMember {
  event CoverPurchased(bytes32 key, address indexed account, address indexed cxToken, uint256 fee, uint256 amountToCover, uint256 expiresOn);

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
  ) external returns (address);

  /**
   * @dev Gets the cover fee info for the given cover key, duration, and amount
   * @param key Enter the cover key
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   * @param amountToCover Enter the amount of the stablecoin `liquidityToken` to cover.
   */
  function getCoverFeeInfo(
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  )
    external
    view
    returns (
      uint256 fee,
      uint256 utilizationRatio,
      uint256 totalAvailableLiquidity,
      uint256 coverRatio,
      uint256 floor,
      uint256 ceiling,
      uint256 rate
    );

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
  function getCoverPoolSummary(bytes32 key) external view returns (uint256[] memory _values);

  function getCxToken(bytes32 key, uint256 coverDuration) external view returns (address cxToken, uint256 expiryDate);

  function getCxTokenByExpiryDate(bytes32 key, uint256 expiryDate) external view returns (address cxToken);

  /**
   * Gets the sum total of cover commitment that haven't expired yet.
   */
  function getCommitment(bytes32 key) external view returns (uint256);

  /**
   * Gets the available liquidity in the pool.
   */
  function getCoverable(bytes32 key) external view returns (uint256);

  /**
   * @dev Gets the expiry date based on cover duration
   * @param today Enter the current timestamp
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function getExpiryDate(uint256 today, uint256 coverDuration) external pure returns (uint256);
}
