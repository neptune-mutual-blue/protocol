// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
// import "../../interfaces/IVault.sol";
import "../Recoverable.sol";
import "../../interfaces/ILendingStrategy.sol";
import "../../interfaces/ILiquidityEngine.sol";
import "../../libraries/NTransferUtilV2.sol";

/**
 * @title Liquidity Engine contract
 * @dev The liquidity engine contract enables liquidity manager(s)
 * to add, disable, remove, or manage lending or other income strategies.
 *
 */
contract LiquidityEngine is ILiquidityEngine, Recoverable {
  using NTransferUtilV2 for IERC20;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using StrategyLibV1 for IStore;
  using ValidationLibV1 for IStore;

  constructor(IStore s) Recoverable(s) {} // solhint-disable-line

  /**
   * @dev Adds an array of strategies to the liquidity engine.
   * @param strategies Enter one or more strategies.
   */
  function addStrategies(address[] calldata strategies) external override nonReentrant {
    require(strategies.length > 0, "No strategy specified");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.addStrategiesInternal(strategies);
  }

  /**
   * @dev The liquidity state update interval allows the protocol
   * to perform various activies such as NPM token price update,
   * deposits or withdrawals to lending strategies, and more.
   *
   * @param value Specify the update interval value
   *
   */
  function setLiquidityStateUpdateInterval(uint256 value) external override nonReentrant {
    require(value > 0, "Invalid value");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.setUintByKey(ProtoUtilV1.NS_LIQUIDITY_STATE_UPDATE_INTERVAL, value);
    emit LiquidityStateUpdateIntervalSet(value);
  }

  /**
   * @dev Disables a strategy by address.
   * When a strategy is disabled, it immediately withdraws and cannot lend any further.
   *
   * @custom:suppress-address-trust-issue The address `strategy` can be trusted because of the ACL requirement.
   *
   * @param strategy Enter the strategy contract address to disable
   */
  function disableStrategy(address strategy) external override nonReentrant {
    // because this function can only be invoked by a liquidity manager.
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.disableStrategyInternal(strategy);
    emit StrategyDisabled(strategy);
  }

  /**
   * @dev Permanently deletes a disabled strategy by address.
   *
   * @custom:suppress-address-trust-issue This instance of strategy can be trusted because of the ACL requirement.
   *
   * @param strategy Enter the strategy contract address to delete
   */
  function deleteStrategy(address strategy) external override nonReentrant {
    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.deleteStrategyInternal(strategy);
    emit StrategyDeleted(strategy);
  }

  /**
   * @dev In order to pool risks collectively, liquidity providers
   * may lend their stablecoins to a cover pool of their choosing during "lending periods"
   * and withdraw them during "withdrawal windows." These periods are known as risk pooling periods.
   *
   * <br /> <br />
   *
   * The default lending period is six months, and the withdrawal window is seven days.
   * Specify a cover key if you want to configure or override these periods for a cover.
   * If no cover key is specified, the values entered will be set as global parameters.
   *
   * @param coverKey Enter a cover key to set the periods. Enter `0x` if you want to set the values globally.
   * @param lendingPeriod Enter the lending duration. Example: 180 days.
   * @param withdrawalWindow Enter the withdrawal duration. Example: 7 days.
   *
   */
  function setRiskPoolingPeriods(
    bytes32 coverKey,
    uint256 lendingPeriod,
    uint256 withdrawalWindow
  ) external override nonReentrant {
    require(lendingPeriod > 0, "Please specify lending period");
    require(withdrawalWindow > 0, "Please specify withdrawal window");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.setRiskPoolingPeriodsInternal(coverKey, lendingPeriod, withdrawalWindow);
    // event emitted in the above function
  }

  /**
   * @dev Specify the maximum lending ratio a strategy can utilize, not to exceed 100 percent.
   *
   * @param ratio. Enter the ratio as a percentage value. Use `ProtoUtilV1.MULTIPLIER` as your divisor.
   *
   */
  function setMaxLendingRatio(uint256 ratio) external override nonReentrant {
    require(ratio > 0, "Please specify lending ratio");
    require(ratio <= ProtoUtilV1.MULTIPLIER, "Invalid lending ratio");

    s.mustNotBePaused();
    AccessControlLibV1.mustBeLiquidityManager(s);

    s.setMaxLendingRatioInternal(ratio);
  }

  /**
   * @dev Gets the maximum lending ratio a strategy can utilize.
   */
  function getMaxLendingRatio() external view override returns (uint256 ratio) {
    return s.getMaxLendingRatioInternal();
  }

  /**
   * @dev Returns the risk pooling periods of a given cover key.
   * Global values are returned if the risk pooling period for the given cover key was not defined.
   * If global values are also undefined, fallback value of 180-day lending period
   * and 7-day withdrawal window are returned.
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter the coverkey to retrieve the lending period of.
   * Warning: this function doesn't check if the supplied cover key is a valid.
   *
   */
  function getRiskPoolingPeriods(bytes32 coverKey) external view override returns (uint256 lendingPeriod, uint256 withdrawalWindow) {
    return s.getRiskPoolingPeriodsInternal(coverKey);
  }

  /**
   * @dev Returns a list of disabled strategies.
   */
  function getDisabledStrategies() external view override returns (address[] memory strategies) {
    return s.getDisabledStrategiesInternal();
  }

  /**
   * @dev Returns a list of actively lending strategies.
   */
  function getActiveStrategies() external view override returns (address[] memory strategies) {
    return s.getActiveStrategiesInternal();
  }

  function addBulkLiquidity(IVault.AddLiquidityArgs[] calldata args) external override {
    IERC20 stablecoin = IERC20(s.getStablecoinAddressInternal());
    IERC20 npm = s.getNpmTokenInstanceInternal();

    uint256 totalAmount;
    uint256 totalNpm;

    for (uint256 i = 0; i < args.length; i++) {
      totalAmount += args[i].amount;
      totalNpm += args[i].npmStakeToAdd;
    }

    stablecoin.ensureTransferFrom(msg.sender, address(this), totalAmount);
    npm.ensureTransferFrom(msg.sender, address(this), totalNpm);

    for (uint256 i = 0; i < args.length; i++) {
      IVault vault = s.getVault(args[i].coverKey);
      uint256 balance = vault.balanceOf(address(this));

      if (balance > 0) {
        IERC20(vault).ensureTransfer(s.getTreasuryAddressInternal(), balance);
      }

      stablecoin.approve(address(vault), args[i].amount);
      npm.approve(address(vault), args[i].npmStakeToAdd);

      vault.addLiquidity(args[i]);

      balance = vault.balanceOf(address(this));

      require(balance > 0, "Fatal, no PODs minted");

      IERC20(vault).ensureTransfer(msg.sender, vault.balanceOf(address(this)));
    }
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
    return ProtoUtilV1.CNAME_LIQUIDITY_ENGINE;
  }
}
