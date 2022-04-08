// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IStore.sol";
import "../interfaces/external/IUniswapV2RouterLike.sol";
import "../interfaces/external/IUniswapV2PairLike.sol";
import "../interfaces/external/IUniswapV2FactoryLike.sol";
import "./NTransferUtilV2.sol";
import "./ProtoUtilV1.sol";
import "./StoreKeyUtil.sol";
import "./ValidationLibV1.sol";
import "./RegistryLibV1.sol";

library PriceLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  function setTokenPriceInStablecoinInternal(IStore s, address token) internal {
    if (token == address(0)) {
      return;
    }

    address stablecoin = s.getStablecoin();
    setTokenPriceInternal(s, token, stablecoin);
  }

  function setTokenPriceInternal(
    IStore s,
    address token,
    address stablecoin
  ) internal {
    IUniswapV2PairLike pair = _getPair(s, token, stablecoin);
    _setTokenPrice(s, token, stablecoin, pair);
  }

  /**
   * @dev Returns the last persisted pair info
   * @param s Provide store instance
   * @param pair Provide pair instance
   * @param values[0] reserve0
   * @param values[1] reserve1
   * @param values[2] totalSupply
   */
  function getLastKnownPairInfoInternal(IStore s, IUniswapV2PairLike pair) public view returns (uint256[] memory values) {
    values = new uint256[](3);

    values[0] = s.getUintByKey(_getReserve0Key(pair));
    values[1] = s.getUintByKey(_getReserve1Key(pair));
    values[2] = s.getUintByKey(_getPairTotalSupplyKey(pair));
  }

  function _setTokenPrice(
    IStore s,
    address token,
    address stablecoin,
    IUniswapV2PairLike pair
  ) private {
    if (token == stablecoin) {
      return;
    }

    (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();

    s.setUintByKey(_getReserve0Key(pair), reserve0);
    s.setUintByKey(_getReserve1Key(pair), reserve1);
    s.setUintByKey(_getPairTotalSupplyKey(pair), pair.totalSupply());
  }

  function getPairLiquidityInStablecoin(
    IStore s,
    IUniswapV2PairLike pair,
    uint256 lpTokens
  ) external view returns (uint256) {
    uint256[] memory values = getLastKnownPairInfoInternal(s, pair);

    uint256 reserve0 = values[0];
    uint256 reserve1 = values[1];
    uint256 supply = values[2];

    require(supply > 0, "Invalid pair or price not updated");

    address stablecoin = s.getStablecoin();

    if (pair.token0() == stablecoin) {
      return (2 * reserve0 * lpTokens) / supply;
    }

    return (2 * reserve1 * lpTokens) / supply;
  }

  function getLastUpdateOnInternal(IStore s) external view returns (uint256) {
    bytes32 key = getLastUpdateKey();
    return s.getUintByKey(key);
  }

  function setLastUpdateOn(IStore s) external {
    bytes32 key = getLastUpdateKey();
    s.setUintByKey(key, block.timestamp); // solhint-disable-line
  }

  function getLastUpdateKey() public pure returns (bytes32) {
    return ProtoUtilV1.NS_LAST_LIQUIDITY_STATE_UPDATE;
  }

  function getPriceInternal(
    IStore s,
    address token,
    address stablecoin,
    uint256 multiplier
  ) public view returns (uint256) {
    IUniswapV2PairLike pair = _getPair(s, token, stablecoin);
    IUniswapV2RouterLike router = IUniswapV2RouterLike(s.getUniswapV2Router());

    uint256[] memory values = getLastKnownPairInfoInternal(s, pair);
    uint256 reserve0 = values[0];
    uint256 reserve1 = values[1];

    if (pair.token0() == stablecoin) {
      return router.getAmountIn(multiplier, reserve0, reserve1);
    }

    return router.getAmountIn(multiplier, reserve1, reserve0);
  }

  function getNpmPriceInternal(IStore s, uint256 multiplier) external view returns (uint256) {
    return getPriceInternal(s, s.getNpmTokenAddress(), s.getStablecoin(), multiplier);
  }

  function _getReserve0Key(IUniswapV2PairLike pair) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LP_RESERVE0, pair));
  }

  function _getReserve1Key(IUniswapV2PairLike pair) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LP_RESERVE1, pair));
  }

  function _getPairTotalSupplyKey(IUniswapV2PairLike pair) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LP_TOTAL_SUPPLY, pair));
  }

  function _getPair(
    IStore s,
    address token,
    address stablecoin
  ) private view returns (IUniswapV2PairLike) {
    IUniswapV2FactoryLike factory = IUniswapV2FactoryLike(s.getUniswapV2Factory());
    IUniswapV2PairLike pair = IUniswapV2PairLike(factory.getPair(token, stablecoin));

    return pair;
  }
}
