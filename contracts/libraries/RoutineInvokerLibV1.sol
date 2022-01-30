// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IStore.sol";
import "../interfaces/ILendingStrategy.sol";
import "./PriceLibV1.sol";
import "./ProtoUtilV1.sol";
import "./StrategyLibV1.sol";

library RoutineInvokerLibV1 {
  using PriceLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using StrategyLibV1 for IStore;

  function updateStateAndLiquidity(IStore s, bytes32 key) external {
    _invoke(s, key, address(0));
  }

  function updateStateAndLiquidity(
    IStore s,
    bytes32 key,
    address token
  ) external {
    _invoke(s, key, token);
  }

  function _invoke(
    IStore s,
    bytes32 key,
    address token
  ) private {
    _updateKnownTokenPrices(s, token);

    if (key > 0) {
      _invokeAssetManagement(s, key);
    }
  }

  function _invokeAssetManagement(IStore s, bytes32 key) private {
    // @todo if the cover is reported or claimable, withdraw everything
    address vault = s.getVaultAddress(key);
    IERC20 stablecoin = IERC20(s.getStablecoin());

    uint256 amount = (stablecoin.balanceOf(vault) * StrategyLibV1.MAX_LENDING_RATIO) / ProtoUtilV1.MULTIPLIER;

    _withdrawFromDisabled(s, key, vault);

    if (amount == 0) {
      return;
    }

    address[] memory strategies = s.getActiveStrategiesInternal();

    for (uint256 i = 0; i < strategies.length; i++) {
      ILendingStrategy strategy = ILendingStrategy(strategies[i]);
      uint256 balance = IERC20(strategy.getDepositCertificate()).balanceOf(vault);

      // @todo: update `ProtoUtilV1.NS_COVER_LIQUIDITY` to add lending income difference
      if (balance > 0) {
        strategy.withdraw(key, vault);
      }
    }
  }

  function _withdrawFromDisabled(
    IStore s,
    bytes32 key,
    address onBehalfOf
  ) private {
    address[] memory strategies = s.getDisabledStrategiesInternal();

    for (uint256 i = 0; i < strategies.length; i++) {
      ILendingStrategy strategy = ILendingStrategy(strategies[i]);
      uint256 balance = IERC20(strategy.getDepositCertificate()).balanceOf(onBehalfOf);

      if (balance > 0) {
        strategy.withdraw(key, onBehalfOf);
      }
    }
  }

  function _deposit(
    IStore s,
    bytes32 key,
    address onBehalfOf,
    uint256 amount
  ) private {}

  function _withdraw(
    IStore s,
    bytes32 key,
    address onBehalfOf,
    uint256 amount
  ) private {}

  function _withdrawRewards(
    IStore s,
    bytes32 key,
    address onBehalfOf
  ) private {}

  /***** */

  function _updateKnownTokenPrices(IStore s, address token) private {
    address npm = s.getNpmTokenAddress();

    if (token != address(0) && token != npm) {
      PriceLibV1.setTokenPriceInStablecoinInternal(s, token);
    }

    PriceLibV1.setTokenPriceInStablecoinInternal(s, npm);
  }
}
