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
import "../../libraries/PolicyHelperV1.sol";
import "../../libraries/BokkyPooBahsDateTimeLibrary.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../../libraries/RoutineInvokerLibV1.sol";
import "../Recoverable.sol";

/**
 * @title Policy Contract
 * @dev The policy contract enables you to a purchase cover
 */
contract Policy is IPolicy, Recoverable {
  using PolicyHelperV1 for IStore;
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using ValidationLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;

  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

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
  function purchaseCover(
    bytes32 key,
    uint256 coverDuration,
    uint256 amountToCover
  ) external override nonReentrant returns (address) {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.mustBeValidCover(key);

    require(coverDuration > 0 && coverDuration <= 3, "Invalid cover duration");

    (ICxToken cxToken, uint256 fee) = s.purchaseCoverInternal(key, coverDuration, amountToCover);

    emit CoverPurchased(key, msg.sender, address(cxToken), fee, amountToCover, cxToken.expiresOn());
    return address(cxToken);
  }

  function getCxToken(bytes32 key, uint256 coverDuration) external view override returns (address cxToken, uint256 expiryDate) {
    return s.getCxTokenInternal(key, coverDuration);
  }

  function getCxTokenByExpiryDate(bytes32 key, uint256 expiryDate) external view override returns (address cxToken) {
    return s.getCxTokenByExpiryDateInternal(key, expiryDate);
  }

  /**
   * @dev Gets the expiry date based on cover duration
   * @param today Enter the current timestamp
   * @param coverDuration Enter the number of months to cover. Accepted values: 1-3.
   */
  function getExpiryDate(uint256 today, uint256 coverDuration) external pure override returns (uint256) {
    return CoverUtilV1.getExpiryDateInternal(today, coverDuration);
  }

  /**
   * Gets the sum total of cover commitment that has not expired yet.
   */
  function getCommitment(bytes32 key) external view override returns (uint256) {
    return s.getCommitmentInternal(key);
  }

  /**
   * Gets the available liquidity in the pool.
   */
  function getCoverable(bytes32 key) external view override returns (uint256) {
    return s.getCoverableInternal(key);
  }

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
    return s.getCoverFeeInfoInternal(key, coverDuration, amountToCover);
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
    return s.getCoverPoolSummaryInternal(key);
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
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_POLICY;
  }
}
