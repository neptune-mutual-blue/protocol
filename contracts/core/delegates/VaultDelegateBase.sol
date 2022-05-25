// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../Recoverable.sol";
import "../../interfaces/IVaultDelegate.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/VaultLibV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../../libraries/StrategyLibV1.sol";

/**
 * @title Vault POD (Proof of Deposit)
 * @dev The VaultPod has `_mintPods` and `_redeemPodCalculation` features which enables
 * POD minting and burning on demand. <br /> <br />
 *
 * **How Does This Work?**
 *
 * When you add liquidity to the Vault,
 * PODs are minted representing your proportional share of the pool.
 * Similarly, when you redeem your PODs, you get your proportional
 * share of the Vault liquidity back, burning the PODs.
 */
abstract contract VaultDelegateBase is IVaultDelegate, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using VaultLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using StrategyLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  function preTransferGovernance(
    address caller,
    bytes32 coverKey,
    address, /*to*/
    uint256 /*amount*/
  ) external override nonReentrant returns (address stablecoin) {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeClaimsProcessorContract(caller);

    stablecoin = s.getStablecoin();
  }

  function postTransferGovernance(
    address, /*caller*/
    bytes32 coverKey,
    address, /*to*/
    uint256 /*amount*/
  ) external view override {
    s.senderMustBeVaultContract(coverKey);
    // @suppress-reentrancy The `postTransferGovernance` hook is executed under the same context of `preTransferGovernance`.
    // @note: do not update state and liquidity since `transferGovernance` is an internal contract-only function
  }

  function preTransferToStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);

    s.preTransferToStrategyInternal(token, coverKey, strategyName, amount);
  }

  function postTransferToStrategy(
    address, /*caller*/
    IERC20, /*token*/
    bytes32 coverKey,
    bytes32, /*strategyName*/
    uint256 /*amount*/
  ) external view override {
    s.senderMustBeVaultContract(coverKey);
    // @suppress-reentrancy The `postTransferToStrategy` hook is executed under the same context of `preTransferToStrategy`.
    // @note: do not update state and liquidity since `transferToStrategy` itself is a part of the state update
  }

  function preReceiveFromStrategy(
    address caller,
    IERC20, /*token*/
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 /*amount*/
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);
  }

  function postReceiveFromStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override returns (uint256 income, uint256 loss) {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeStrategyContract(caller);

    (income, loss) = s.postReceiveFromStrategyInternal(token, coverKey, strategyName, amount);
    // @suppress-reentrancy The `postReceiveFromStrategy` hook is executed under the same context of `preReceiveFromStrategy`.
    // @note: do not update state and liquidity since `receiveFromStrategy` itself is a part of the state update
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of liquidity token to supply.
   * @param npmStakeToAdd Enter the amount of NPM token to stake.
   */
  function preAddLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStakeToAdd
  ) external override nonReentrant returns (uint256 podsToMint, uint256 previousNpmStake) {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    s.mustHaveNormalCoverStatus(coverKey);

    address pod = msg.sender;
    (podsToMint, previousNpmStake) = s.preAddLiquidityInternal(coverKey, pod, caller, amount, npmStakeToAdd);
  }

  function postAddLiquidity(
    address, /*caller*/
    bytes32 coverKey,
    uint256, /*amount*/
    uint256 /*npmStakeToAdd*/
  ) external override {
    s.senderMustBeVaultContract(coverKey);
    s.updateStateAndLiquidity(coverKey);

    // @suppress-reentrancy The `postAddLiquidity` hook is executed under the same context of `preAddLiquidity`.
  }

  function accrueInterestImplementation(address caller, bytes32 coverKey) external override {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    AccessControlLibV1.callerMustBeLiquidityManager(s, caller);

    s.accrueInterestInternal(coverKey);
  }

  /**
   * @dev Removes liquidity from the specified cover contract
   * @param coverKey Enter the cover key
   * @param podsToRedeem Enter the amount of pods to redeem
   * @param npmStakeToRemove Enter the amount of NPM stake to remove.
   */
  function preRemoveLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external override nonReentrant returns (address stablecoin, uint256 stablecoinToRelease) {
    s.mustNotBePaused();
    s.mustMaintainBlockHeightOffset(coverKey);
    s.senderMustBeVaultContract(coverKey);
    s.mustHaveNormalCoverStatus(coverKey);
    s.mustBeDuringWithdrawalPeriod(coverKey);
    s.mustHaveNoBalanceInStrategies(coverKey, stablecoin);
    s.mustBeAccrued(coverKey);

    address pod = msg.sender; // The sender is vault contract
    return s.preRemoveLiquidityInternal(coverKey, pod, caller, podsToRedeem, npmStakeToRemove, exit);
  }

  function postRemoveLiquidity(
    address, /*caller*/
    bytes32 coverKey,
    uint256, /*podsToRedeem*/
    uint256, /*npmStakeToRemove*/
    bool /*exit*/
  ) external override {
    s.senderMustBeVaultContract(coverKey);
    s.updateStateAndLiquidity(coverKey);

    // @suppress-reentrancy The `postRemoveLiquidity` hook is executed under the same context of `preRemoveLiquidity`.
  }

  /**
   * @dev Calculates the amount of PODS to mint for the given amount of liquidity to transfer
   */
  function calculatePodsImplementation(bytes32 coverKey, uint256 forStablecoinUnits) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);

    address pod = msg.sender;

    return s.calculatePodsInternal(coverKey, pod, forStablecoinUnits);
  }

  /**
   * @dev Calculates the amount of stablecoins to withdraw for the given amount of PODs to redeem
   */
  function calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    address pod = msg.sender;
    return s.calculateLiquidityInternal(coverKey, pod, podsToBurn);
  }

  /**
   * @dev Returns the stablecoin balance of this vault
   * This also includes amounts lent out in lending strategies
   */
  function getStablecoinBalanceOfImplementation(bytes32 coverKey) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    return s.getStablecoinOwnedByVaultInternal(coverKey);
  }

  /**
   * @dev Gets information of a given vault by the cover key
   * @param coverKey Specify cover key to obtain the info of.
   * @param you The address for which the info will be customized
   * @param values[0] totalPods --> Total PODs in existence
   * @param values[1] balance --> Stablecoins held in the vault
   * @param values[2] extendedBalance --> Stablecoins lent outside of the protocol
   * @param values[3] totalReassurance -- > Total reassurance for this cover
   * @param values[4] myPodBalance --> Your POD Balance
   * @param values[5] myShare --> My share of the liquidity pool (in stablecoin)
   * @param values[6] withdrawalOpen --> The timestamp when withdrawals are opened
   * @param values[7] withdrawalClose --> The timestamp when withdrawals are closed again
   */
  function getInfoImplementation(bytes32 coverKey, address you) external view override returns (uint256[] memory values) {
    s.senderMustBeVaultContract(coverKey);
    address pod = msg.sender;
    return s.getInfoInternal(coverKey, pod, you);
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
    return ProtoUtilV1.CNAME_VAULT_DELEGATE;
  }
}
