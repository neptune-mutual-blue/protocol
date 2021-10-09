// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IPriceDiscovery.sol";
import "../../interfaces/IStore.sol";
import "../../interfaces/external/IUniswapV2RouterLike.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../Recoverable.sol";

contract PriceDiscovery is IPriceDiscovery, Recoverable {
  using ProtoUtilV1 for IStore;

  constructor(IStore store) Recoverable(store) {
    this;
  }

  function getTokenPriceInStableCoin(address token, uint256 multiplier) external view override returns (uint256) {
    address stablecoin = s.getLiquidityToken();
    return this.getTokenPriceInLiquidityToken(token, stablecoin, multiplier);
  }

  // Todo: check this implementation
  function getTokenPriceInLiquidityToken(
    address token,
    address liquidityToken,
    uint256 multiplier
  ) external view override returns (uint256) {
    if (token == liquidityToken) {
      return multiplier;
    }

    address[] memory pair = new address[](2);

    pair[0] = token;
    pair[1] = liquidityToken;

    IUniswapV2RouterLike router = IUniswapV2RouterLike(s.getUniswapV2Router());

    uint256[] memory amounts = router.getAmountsOut(multiplier, pair);
    return amounts[amounts.length - 1];
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
    return ProtoUtilV1.CNAME_PRICE_DISCOVERY;
  }
}
