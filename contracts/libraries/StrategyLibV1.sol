// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IStore.sol";
import "../interfaces/ILendingStrategy.sol";
import "./PriceLibV1.sol";
import "./ProtoUtilV1.sol";
import "./RegistryLibV1.sol";

library StrategyLibV1 {
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using RegistryLibV1 for IStore;

  uint256 public constant DEFAULT_LENDING_PERIOD = 180 days;
  uint256 public constant DEFAULT_WITHDRAWAL_WINDOW = 7 days;

  event StrategyAdded(address indexed strategy);
  event LendingPeriodSet(bytes32 indexed key, uint256 lendingPeriod, uint256 withdrawalWindow);
  event MaxLendingRatioSet(uint256 ratio);

  function _getIsActiveStrategyKey(address strategyAddress) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE, strategyAddress));
  }

  function _getIsDisabledStrategyKey(address strategyAddress) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_LENDING_STRATEGY_DISABLED, strategyAddress));
  }

  function disableStrategyInternal(IStore s, address toFind) external {
    // @suppress-address-trust-issue Check caller.
    _disableStrategy(s, toFind);

    s.setAddressArrayByKey(ProtoUtilV1.NS_LENDING_STRATEGY_DISABLED, toFind);
  }

  function deleteStrategyInternal(IStore s, address toFind) external {
    // @suppress-address-trust-issue Check caller.
    _deleteStrategy(s, toFind);
  }

  function addStrategiesInternal(IStore s, address[] calldata strategies) external {
    for (uint256 i = 0; i < strategies.length; i++) {
      address strategy = strategies[i];
      _addStrategy(s, strategy);
    }
  }

  function getLendingPeriodsInternal(IStore s, bytes32 coverKey) external view returns (uint256 lendingPeriod, uint256 withdrawalWindow) {
    lendingPeriod = s.getUintByKey(getLendingPeriodKey(coverKey));
    withdrawalWindow = s.getUintByKey(getWithdrawalWindowKey(coverKey));

    if (lendingPeriod == 0) {
      lendingPeriod = s.getUintByKey(getLendingPeriodKey(0));
      withdrawalWindow = s.getUintByKey(getWithdrawalWindowKey(0));
    }

    lendingPeriod = lendingPeriod == 0 ? DEFAULT_LENDING_PERIOD : lendingPeriod;
    withdrawalWindow = withdrawalWindow == 0 ? DEFAULT_WITHDRAWAL_WINDOW : withdrawalWindow;
  }

  function setLendingPeriodsInternal(
    IStore s,
    bytes32 coverKey,
    uint256 lendingPeriod,
    uint256 withdrawalWindow
  ) external {
    s.setUintByKey(getLendingPeriodKey(coverKey), lendingPeriod);
    s.setUintByKey(getWithdrawalWindowKey(coverKey), withdrawalWindow);

    emit LendingPeriodSet(coverKey, lendingPeriod, withdrawalWindow);
  }

  function getLendingPeriodKey(bytes32 coverKey) public pure returns (bytes32) {
    if (coverKey > 0) {
      return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_LENDING_PERIOD, coverKey));
    }

    return ProtoUtilV1.NS_COVER_LIQUIDITY_LENDING_PERIOD;
  }

  function getMaxLendingRatioInternal(IStore s) external view returns (uint256) {
    return s.getUintByKey(getMaxLendingRatioKey());
  }

  function setMaxLendingRatioInternal(IStore s, uint256 ratio) external {
    s.setUintByKey(getMaxLendingRatioKey(), ratio);

    emit MaxLendingRatioSet(ratio);
  }

  function getMaxLendingRatioKey() public pure returns (bytes32) {
    return ProtoUtilV1.NS_COVER_LIQUIDITY_MAX_LENDING_RATIO;
  }

  function getWithdrawalWindowKey(bytes32 coverKey) public pure returns (bytes32) {
    if (coverKey > 0) {
      return keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_LIQUIDITY_WITHDRAWAL_WINDOW, coverKey));
    }

    return ProtoUtilV1.NS_COVER_LIQUIDITY_WITHDRAWAL_WINDOW;
  }

  function _addStrategy(IStore s, address deployedOn) private {
    ILendingStrategy strategy = ILendingStrategy(deployedOn);
    require(strategy.getWeight() <= ProtoUtilV1.MULTIPLIER, "Weight too much");

    s.setBoolByKey(_getIsActiveStrategyKey(deployedOn), true);
    s.setAddressArrayByKey(ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE, deployedOn);
    emit StrategyAdded(deployedOn);
  }

  function _disableStrategy(IStore s, address toFind) private {
    bytes32 key = ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE;

    uint256 pos = s.getAddressArrayItemPosition(key, toFind);
    require(pos > 0, "Invalid strategy");

    s.deleteAddressArrayItem(key, toFind);
    s.setBoolByKey(_getIsActiveStrategyKey(toFind), false);
    s.setBoolByKey(_getIsDisabledStrategyKey(toFind), true);
  }

  function _deleteStrategy(IStore s, address toFind) private {
    bytes32 key = ProtoUtilV1.NS_LENDING_STRATEGY_DISABLED;

    uint256 pos = s.getAddressArrayItemPosition(key, toFind);
    require(pos > 0, "Invalid strategy");

    s.deleteAddressArrayItem(key, toFind);
    s.setBoolByKey(_getIsDisabledStrategyKey(toFind), false);
  }

  function getDisabledStrategiesInternal(IStore s) external view returns (address[] memory strategies) {
    return s.getAddressArrayByKey(ProtoUtilV1.NS_LENDING_STRATEGY_DISABLED);
  }

  function getActiveStrategiesInternal(IStore s) external view returns (address[] memory strategies) {
    return s.getAddressArrayByKey(ProtoUtilV1.NS_LENDING_STRATEGY_ACTIVE);
  }

  function getStrategyOutKey(bytes32 coverKey, address token) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_STRATEGY_OUT, coverKey, token));
  }

  function getSpecificStrategyOutKey(
    bytes32 coverKey,
    bytes32 strategyName,
    address token
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_STRATEGY_OUT, coverKey, strategyName, token));
  }

  function getAmountInStrategies(
    IStore s,
    bytes32 coverKey,
    address token
  ) public view returns (uint256) {
    bytes32 k = getStrategyOutKey(coverKey, token);
    return s.getUintByKey(k);
  }

  function getAmountInStrategy(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    address token
  ) public view returns (uint256) {
    bytes32 k = getSpecificStrategyOutKey(coverKey, strategyName, token);
    return s.getUintByKey(k);
  }

  function preTransferToStrategyInternal(
    IStore s,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external {
    if (s.getStablecoin() == address(token) == false) {
      return;
    }

    _addToStrategyOut(s, coverKey, address(token), amount);
    _addToSpecificStrategyOut(s, coverKey, strategyName, address(token), amount);
  }

  function postReceiveFromStrategyInternal(
    IStore s,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 received
  ) external returns (uint256 income, uint256 loss) {
    if (s.getStablecoin() == address(token) == false) {
      return (income, loss);
    }

    uint256 amountInThisStrategy = getAmountInStrategy(s, coverKey, strategyName, address(token));

    income = received > amountInThisStrategy ? received - amountInThisStrategy : 0;
    loss = received < amountInThisStrategy ? amountInThisStrategy - received : 0;

    _reduceStrategyOut(s, coverKey, address(token), amountInThisStrategy);
    _clearSpecificStrategyOut(s, coverKey, strategyName, address(token));

    _logIncomes(s, coverKey, strategyName, income, loss);
  }

  function _addToStrategyOut(
    IStore s,
    bytes32 coverKey,
    address token,
    uint256 amountToAdd
  ) private {
    bytes32 k = getStrategyOutKey(coverKey, token);
    s.addUintByKey(k, amountToAdd);
  }

  function _reduceStrategyOut(
    IStore s,
    bytes32 coverKey,
    address token,
    uint256 amount
  ) private {
    bytes32 k = getStrategyOutKey(coverKey, token);
    s.subtractUintByKey(k, amount);
  }

  function _addToSpecificStrategyOut(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    address token,
    uint256 amountToAdd
  ) private {
    bytes32 k = getSpecificStrategyOutKey(coverKey, strategyName, token);
    s.addUintByKey(k, amountToAdd);
  }

  function _clearSpecificStrategyOut(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    address token
  ) private {
    bytes32 k = getSpecificStrategyOutKey(coverKey, strategyName, token);
    s.deleteUintByKey(k);
  }

  function _logIncomes(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 income,
    uint256 loss
  ) private {
    // Overall Income
    s.addUintByKey(ProtoUtilV1.NS_VAULT_LENDING_INCOMES, income);

    // By Cover
    s.addUintByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_LENDING_INCOMES, coverKey)), income);

    // By Cover on This Strategy
    s.addUintByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_LENDING_INCOMES, coverKey, strategyName)), income);

    // Overall Loss
    s.addUintByKey(ProtoUtilV1.NS_VAULT_LENDING_LOSSES, loss);

    // By Cover
    s.addUintByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_LENDING_LOSSES, coverKey)), loss);

    // By Cover on This Strategy
    s.addUintByKey(keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_LENDING_LOSSES, coverKey, strategyName)), loss);
  }

  function getStablecoinOwnedByVaultInternal(IStore s, bytes32 coverKey) external view returns (uint256) {
    address stablecoin = s.getStablecoin();

    uint256 balance = IERC20(stablecoin).balanceOf(s.getVaultAddress(coverKey));
    uint256 inStrategies = getAmountInStrategies(s, coverKey, stablecoin);

    return balance + inStrategies;
  }
}
