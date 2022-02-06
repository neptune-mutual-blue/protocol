// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IStore.sol";
import "../interfaces/ILendingStrategy.sol";
import "./PriceLibV1.sol";
import "./ProtoUtilV1.sol";
import "./CoverUtilV1.sol";
import "./StrategyLibV1.sol";

// @todo: before launch, refactor this to be invoked manually
// A misconfiguration or issue on an external protocol may take the whole system down
library RoutineInvokerLibV1 {
  using PriceLibV1 for IStore;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using StrategyLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  enum Action {
    Deposit,
    Withdraw
  }

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

  function _executeIsWithdrawalPeriod(IStore s, bytes32 coverKey) private returns (bool) {
    (uint256 lendingPeriod, uint256 withdrawalWindow) = s.getLendingPeriodsInternal(coverKey);

    // Without a lending period and withdrawal window, deposit is not possible
    if (lendingPeriod == 0 || withdrawalWindow == 0) {
      return true;
    }

    // Get the withdrawal period of this cover liquidity
    uint256 start = s.getUintByKey(_getNextWithdrawalStartKey(coverKey));
    uint256 end = s.getUintByKey(_getNextWithdrawalEndKey(coverKey));

    // solhint-disable-next-line
    if (block.timestamp >= start && block.timestamp <= end) {
      return true;
    }

    // The withdrawal period is now over.
    // Deposits can be performed again.
    // Set the next withdrawal cycle
    if (block.timestamp > end) {
      // solhint-disable-previous-line

      // Next Withdrawal Cycle

      // Withdrawals can start after the lending period
      start = block.timestamp + lendingPeriod; // solhint-disable
      // Withdrawals can be performed until the end of the next withdrawal cycle
      end = start + withdrawalWindow;

      s.setUintByKey(_getNextWithdrawalStartKey(coverKey), start);
      s.setUintByKey(_getNextWithdrawalEndKey(coverKey), end);
    }

    return false;
  }

  function _getNextWithdrawalStartKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_WITHDRAWAL_START, coverKey));
  }

  function _getNextWithdrawalEndKey(bytes32 coverKey) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_WITHDRAWAL_END, coverKey));
  }

  function _executeAndGetAction(
    IStore s,
    ILendingStrategy,
    bytes32 coverKey
  ) private returns (Action) {
    // If the cover is undergoing reporting, withdraw everything
    CoverUtilV1.CoverStatus status = s.getCoverStatus(coverKey);

    if (status != CoverUtilV1.CoverStatus.Normal) {
      // Reset the withdrawal window
      s.setUintByKey(_getNextWithdrawalStartKey(coverKey), 0);
      s.setUintByKey(_getNextWithdrawalEndKey(coverKey), 0);

      return Action.Withdraw;
    }

    if (_executeIsWithdrawalPeriod(s, coverKey)) {
      return Action.Withdraw;
    }

    return Action.Deposit;
  }

  function _canDeposit(
    IStore s,
    ILendingStrategy strategy,
    uint256 totalStrategies,
    bytes32 key
  ) private view returns (uint256) {
    address vault = s.getVaultAddress(key);
    IERC20 stablecoin = IERC20(s.getStablecoin());

    uint256 maximumAllowed = (stablecoin.balanceOf(vault) * StrategyLibV1.MAX_LENDING_RATIO) / ProtoUtilV1.MULTIPLIER;
    uint256 allocation = maximumAllowed / totalStrategies;
    uint256 weight = strategy.getWeight();
    uint256 canDeposit = (allocation * weight) / ProtoUtilV1.MULTIPLIER;
    uint256 alreadyDeposited = _getTotalInDeposits(s, strategy, key);

    if (alreadyDeposited >= canDeposit) {
      return 0;
    }

    return canDeposit - alreadyDeposited;
  }

  function _getTotalInDeposits(
    IStore s,
    ILendingStrategy strategy,
    bytes32 key
  ) private view returns (uint256) {
    bytes32 k = _getStrategyDepositKey(key, strategy);
    return s.getUintByKey(k);
  }

  function _invokeAssetManagement(IStore s, bytes32 key) private {
    address vault = s.getVaultAddress(key);
    _withdrawFromDisabled(s, key, vault);

    address[] memory strategies = s.getActiveStrategiesInternal();

    for (uint256 i = 0; i < strategies.length; i++) {
      ILendingStrategy strategy = ILendingStrategy(strategies[i]);
      _executeStrategy(s, strategy, strategies.length, vault, key);
    }
  }

  function _executeStrategy(
    IStore s,
    ILendingStrategy strategy,
    uint256 totalStrategies,
    address vault,
    bytes32 key
  ) private {
    uint256 canDeposit = _canDeposit(s, strategy, totalStrategies, key);
    uint256 balance = IERC20(s.getStablecoin()).balanceOf(vault);

    if (canDeposit > balance) {
      canDeposit = balance;
    }

    Action action = _executeAndGetAction(s, strategy, key);

    if (action == Action.Deposit && canDeposit == 0) {
      return;
    }

    if (action == Action.Withdraw) {
      uint256 stablecoinWithdrawn = _withdrawAllFromStrategy(strategy, vault, key);
      _clearDeposits(s, key, strategy, stablecoinWithdrawn);
    } else {
      _depositToStrategy(strategy, key, canDeposit);
      _setDeposit(s, key, strategy, canDeposit);
    }
  }

  function _setDeposit(
    IStore s,
    bytes32 key,
    ILendingStrategy strategy,
    uint256 amount
  ) private {
    bytes32 k = _getStrategyDepositKey(key, strategy);
    s.addUintByKey(k, amount);
    s.addUintByKey(CoverUtilV1.getCoverTotalLentKey(key), amount);
  }

  function _clearDeposits(
    IStore s,
    bytes32 key,
    ILendingStrategy strategy,
    uint256 withdrawn
  ) private {
    uint256 deposited = _getTotalInDeposits(s, strategy, key);
    uint256 difference = 0;

    if (deposited >= withdrawn) {
      difference = deposited - withdrawn;
      s.subtractUint(CoverUtilV1.getCoverLiquidityKey(key), difference);
    } else {
      difference = withdrawn - deposited;
      s.addUint(CoverUtilV1.getCoverLiquidityKey(key), difference);
    }

    bytes32 k = _getStrategyDepositKey(key, strategy);
    s.deleteUintByKey(k);

    s.subtractUintByKey(CoverUtilV1.getCoverTotalLentKey(key), deposited);
  }

  function _getStrategyDepositKey(bytes32 key, ILendingStrategy strategy) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_DEPOSITS, key, strategy.getKey()));
  }

  function _depositToStrategy(
    ILendingStrategy strategy,
    bytes32 key,
    uint256 amount
  ) private {
    strategy.deposit(key, amount);
  }

  function _withdrawAllFromStrategy(
    ILendingStrategy strategy,
    address vault,
    bytes32 key
  ) private returns (uint256 stablecoinWithdrawn) {
    uint256 balance = IERC20(strategy.getDepositCertificate()).balanceOf(vault);

    if (balance > 0) {
      stablecoinWithdrawn = strategy.withdraw(key);
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
        strategy.withdraw(key);
      }
    }
  }

  function _updateKnownTokenPrices(IStore s, address token) private {
    address npm = s.getNpmTokenAddress();

    if (token != address(0) && token != npm) {
      PriceLibV1.setTokenPriceInStablecoinInternal(s, token);
    }

    PriceLibV1.setTokenPriceInStablecoinInternal(s, npm);
  }
}
