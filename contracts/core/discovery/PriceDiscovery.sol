// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../interfaces/IPriceDiscovery.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/external/IUniswapV2RouterLike.sol";
import "../../libraries/PriceLibV1.sol";
import "../Recoverable.sol";

/**
 * @title Price Discovery Contract
 * @dev Provides features to discover price of a given token, uses UniswapV2 and compatible forks
 */
contract PriceDiscovery is IPriceDiscovery, Recoverable {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using PriceLibV1 for IStore;

  /**
   * @dev Constructs this contract
   * @param store Provide an implementation of IStore
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Gets the price of the given token against the platform's stablecoin.
   * Warning: the `token` and `liquidityToken` must have a Uniswap V2 Pair.
   * the result will be incorrect.
   * @param token Provide the token address to get the price of
   * @param multiplier Enter the token price multiplier
   */
  function getTokenPriceInStableCoin(address token, uint256 multiplier) external view override returns (uint256) {
    address stablecoin = s.getStablecoin();
    return this.getTokenPriceInLiquidityToken(token, stablecoin, multiplier);
  }

  /**
   * @dev Gets the price of the given token against the given liquidity token.
   * Warning: the `token` and `liquidityToken` must have a Uniswap V2 Pair.
   * @param token Provide the token address to get the price of
   * @param liquidityToken Provide the liquidity token address to get the price in
   * @param multiplier Enter the token price multiplier
   */
  function getTokenPriceInLiquidityToken(
    address token,
    address liquidityToken,
    uint256 multiplier
  ) external view override returns (uint256) {
    if (token == liquidityToken) {
      return multiplier;
    }

    uint256 price = s.getPriceInternal(token, liquidityToken, multiplier);

    return price;
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
    return ProtoUtilV1.CNAME_PRICE_DISCOVERY;
  }
}
