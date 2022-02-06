// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
// import "../../interfaces/IVault.sol";
import "../Recoverable.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/StrategyLibV1.sol";
import "../../interfaces/ILendingStrategy.sol";

contract LiquidityEngine is Recoverable {
  using RegistryLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using StrategyLibV1 for IStore;
  using ValidationLibV1 for IStore;

  constructor(IStore s) Recoverable(s) {} // solhint-disable-line

  function addStrategies(IStore s, address[] memory strategies) external nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.addStrategiesInternal(strategies);
  }

  function disableStrategy(IStore s, address strategy) external nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.disableStrategyInternal(strategy);
  }

  function setLendingPeriods(
    bytes32 coverKey,
    uint256 lendingPeriod,
    uint256 withdrawalWindow
  ) external nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.setLendingPeriodsInternal(coverKey, lendingPeriod, withdrawalWindow);
  }

  function setMeta(uint256 lendingPeriod, uint256 withdrawalWindow) external nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.setLendingPeriodsInternal(0, lendingPeriod, withdrawalWindow);
  }

  function getDisabledStrategies(IStore s) external view returns (address[] memory strategies) {
    return s.getDisabledStrategiesInternal();
  }

  function getActiveStrategies(IStore s) external view returns (address[] memory strategies) {
    return s.getActiveStrategiesInternal();
  }
}
