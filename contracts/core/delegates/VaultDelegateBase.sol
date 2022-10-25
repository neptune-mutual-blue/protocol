// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../../interfaces/IVaultDelegate.sol";
import "../../libraries/VaultLibV1.sol";
import "../Recoverable.sol";

/**
 * Important: This contract is not intended to be accessed
 * by anyone/anything except individual vault contracts.
 *
 * @title Vault Delegate Base Contract
 *
 *
 * @dev The vault delegate base contract includes pre and post hooks.
 * The hooks are accessible only to vault contracts.
 *
 */
abstract contract VaultDelegateBase is IVaultDelegate, Recoverable {
  using ProtoUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StrategyLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using VaultLibV1 for IStore;

  /**
   * @dev Constructs this contract
   *
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev This hook runs before `transferGovernance` implementation on vault(s).
   *
   * @custom:suppress-acl This function is only callable by the claims processor contract through the vault contract
   * @custom:note Please note the following:
   *
   * - Governance transfers are allowed via claims processor contract only.
   * - This function's caller must be the vault of the specified coverKey.
   *
   * @param caller Enter your msg.sender value.
   * @param coverKey Provide your vault's cover key.
   *
   * @return stablecoin Returns address of the protocol stablecoin if the hook validation passes.
   *
   */
  function preTransferGovernance(
    address caller,
    bytes32 coverKey,
    address, /*to*/
    uint256 /*amount*/
  ) external override nonReentrant returns (address stablecoin) {
    // @suppress-zero-value-check This function does not transfer any values
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeClaimsProcessorContract(caller);

    stablecoin = s.getStablecoin();
  }

  /**
   * @dev This hook runs after `transferGovernance` implementation on vault(s)
   * and performs cleanup and/or validation if needed.
   *
   * @custom:suppress-acl This function is only callable by the claims processor contract through the vault contract
   * @custom:note do not update state and liquidity since `transferGovernance` is an internal contract-only function
   * @custom:suppress-reentrancy The `postTransferGovernance` hook is executed under the same context of `preTransferGovernance`.
   *
   * @param caller Enter your msg.sender value.
   * @param coverKey Provide your vault's cover key.
   *
   */
  function postTransferGovernance(
    address caller,
    bytes32 coverKey,
    address, /*to*/
    uint256 /*amount*/
  ) external view override {
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeClaimsProcessorContract(caller);
  }

  /**
   * @dev This hook runs before `transferToStrategy` implementation on vault(s)
   *
   * @custom:suppress-acl This function is only callable by a strategy contract through vault contract
   * @custom:note Please note the following:
   *
   * - Transfers are allowed to exact strategy contracts only
   * where the strategy can perform lending.
   *
   * @param caller Enter your msg.sender value
   * @param token Provide the ERC20 token you'd like to transfer to the given strategy
   * @param coverKey Provide your vault's cover key
   * @param strategyName Enter the strategy name
   * @param amount Enter the amount to transfer
   *
   */
  function preTransferToStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override nonReentrant {
    // @suppress-zero-value-check Checked
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);

    s.preTransferToStrategyInternal(token, coverKey, strategyName, amount);
  }

  /**
   * @dev This hook runs after `transferToStrategy` implementation on vault(s)
   * and performs cleanup and/or validation if needed.
   *
   * @custom:suppress-acl This function is only callable by a strategy contract through vault contract
   * @custom:suppress-reentrancy Not required. The `postTransferToStrategy` hook is executed under the same context of `preTransferToStrategy`.
   * @custom:note Do not update state and liquidity since `transferToStrategy` itself is a part of the state update
   *
   * @param caller Enter your msg.sender value
   * @param coverKey Enter the coverKey
   * @param strategyName Enter the strategy name
   *
   */
  function postTransferToStrategy(
    address caller,
    IERC20, /*token*/
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 /*amount*/
  ) external view override {
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);
  }

  /**
   * @dev This hook runs before `receiveFromStrategy` implementation on vault(s)
   *
   * @custom:note Please note the following:
   *
   * - Access is allowed to exact strategy contracts only
   * - The caller must be the strategy contract
   * - msg.sender must be the correct vault contract
   *
   * @param caller Enter your msg.sender value
   * @param coverKey Provide your vault's cover key
   * @param strategyName Enter the strategy name
   *
   */
  function preReceiveFromStrategy(
    address caller,
    IERC20, /*token*/
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 /*amount*/
  ) external override nonReentrant {
    // @suppress-zero-value-check This function does not transfer any tokens
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);
  }

  /**
   * @dev This hook runs after `receiveFromStrategy` implementation on vault(s)
   * and performs cleanup and/or validation if needed.
   *
   * @custom:note Do not update state and liquidity since `receiveFromStrategy` itself is a part of the state update
   * @custom:suppress-reentrancy Not required. The `postReceiveFromStrategy` hook is executed under the same context of `preReceiveFromStrategy`.
   *
   * @param caller Enter your msg.sender value
   * @param token Enter the token your vault received from strategy
   * @param coverKey Enter the coverKey
   * @param strategyName Enter the strategy name
   * @param amount Enter the amount received
   *
   */
  function postReceiveFromStrategy(
    address caller,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override returns (uint256 income, uint256 loss) {
    // @suppress-zero-value-check This call does not perform any transfers
    s.mustNotBePaused();
    s.mustBeProtocolMember(caller);
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.callerMustBeSpecificStrategyContract(caller, strategyName);

    (income, loss) = s.postReceiveFromStrategyInternal(token, coverKey, strategyName, amount);
  }

  /**
   * @dev This hook runs before `addLiquidity` implementation on vault(s)
   *
   * @custom:suppress-acl No need to define ACL as this function is only accessible to associated vault contract of the coverKey
   * @custom:note Please note the following:
   *
   * - msg.sender must be correct vault contract
   *
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of liquidity token to supply.
   * @param npmStakeToAdd Enter the amount of NPM token to stake.
   *
   */
  function preAddLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStakeToAdd
  ) external override nonReentrant returns (uint256 podsToMint, uint256 previousNpmStake) {
    // @suppress-zero-value-check This call does not transfer any tokens
    s.mustNotBePaused();
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);

    ValidationLibV1.mustMaintainStablecoinThreshold(s, amount);
    GovernanceUtilV1.mustNotExceedNpmThreshold(npmStakeToAdd);

    address pod = msg.sender;
    (podsToMint, previousNpmStake) = s.preAddLiquidityInternal(coverKey, pod, caller, amount, npmStakeToAdd);
  }

  /**
   * @dev This hook runs after `addLiquidity` implementation on vault(s)
   * and performs cleanup and/or validation if needed.
   *
   * @custom:suppress-acl No need to define ACL as this function is only accessible to associated vault contract of the coverKey
   * @custom:suppress-reentrancy Not required. The `postAddLiquidity` hook is executed under the same context of `preAddLiquidity`.
   *
   * @param coverKey Enter the coverKey
   *
   */
  function postAddLiquidity(
    address, /*caller*/
    bytes32 coverKey,
    uint256, /*amount*/
    uint256 /*npmStakeToAdd*/
  ) external override {
    // @suppress-zero-value-check This function does not transfer any tokens
    s.mustNotBePaused();
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);
    s.updateStateAndLiquidity(coverKey);
  }

  /**
   * @dev This implemention enables liquidity manages to
   * accrue interests on a vault before withdrawals are allowed.
   *
   * @custom:suppress-acl This function is only accessible to the vault contract
   * @custom:note Please note the following:
   *
   * - Caller must be a liquidity manager
   * - msg.sender must the correct vault contract
   *
   * @param caller Enter your msg.sender value
   * @param coverKey Provide your vault's cover key
   *
   */
  function accrueInterestImplementation(address caller, bytes32 coverKey) external override {
    s.mustNotBePaused();
    s.senderMustBeVaultContract(coverKey);
    AccessControlLibV1.callerMustBeLiquidityManager(s, caller);

    s.accrueInterestInternal(coverKey);
  }

  /**
   * @dev This hook runs before `removeLiquidity` implementation on vault(s)
   *
   * @custom:suppress-acl No need to define ACL as this function is only accessible to associated vault contract of the coverKey
   * @custom:note Please note the following:
   *
   * - msg.sender must be the correct vault contract
   * - Must have at couple of block height offset following a deposit.
   * - Must be done during withdrawal period
   * - Must have no balance in strategies
   * - Cover status should be normal
   * - Interest should already be accrued
   *
   * @param caller Enter your msg.sender value
   * @param coverKey Enter the cover key
   * @param podsToRedeem Enter the amount of pods to redeem
   * @param npmStakeToRemove Enter the amount of NPM stake to remove.
   * @param exit If this is set to true, LPs can remove their entire NPM stake during a withdrawal period. No restriction.
   *
   */
  function preRemoveLiquidity(
    address caller,
    bytes32 coverKey,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external override nonReentrant returns (address stablecoin, uint256 stablecoinToRelease) {
    // @suppress-zero-value-check This call does not transfer any tokens
    s.mustNotBePaused();
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.mustMaintainBlockHeightOffset(coverKey);
    s.mustEnsureAllProductsAreNormal(coverKey);
    s.mustBeDuringWithdrawalPeriod(coverKey);
    s.mustHaveNoBalanceInStrategies(coverKey, stablecoin);
    s.mustBeAccrued(coverKey);

    address pod = msg.sender; // The sender is vault contract
    return s.preRemoveLiquidityInternal(coverKey, pod, caller, podsToRedeem, npmStakeToRemove, exit);
  }

  /**
   * @dev This hook runs after `removeLiquidity` implementation on vault(s)
   * and performs cleanup and/or validation if needed.
   *
   * @custom:suppress-acl No need to define ACL as this function is only accessible to associated vault contract of the coverKey
   * @custom:suppress-reentrancy Not required. The `postRemoveLiquidity` hook is executed under the same context as `preRemoveLiquidity`.
   *
   * @param coverKey Enter the coverKey
   *
   */
  function postRemoveLiquidity(
    address, /*caller*/
    bytes32 coverKey,
    uint256, /*podsToRedeem*/
    uint256, /*npmStakeToRemove*/
    bool /*exit*/
  ) external override {
    // @suppress-zero-value-check The uint values are not used and therefore not checked
    s.mustNotBePaused();
    s.mustBeProtocolMember(msg.sender);
    s.senderMustBeVaultContract(coverKey);
    s.updateStateAndLiquidity(coverKey);
  }

  /**
   * @dev Calculates the amount of PODs to mint for the given amount of stablecoin
   *
   * @param coverKey Enter the cover for which you want to calculate PODs
   * @param stablecoinIn Enter the amount in the stablecoin units
   *
   * @return Returns the units of PODs to be minted if this stablecoin liquidity was supplied.
   * Be warned that this value may change based on the cover vault's usage.
   *
   */
  function calculatePodsImplementation(bytes32 coverKey, uint256 stablecoinIn) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);

    address pod = msg.sender;

    return s.calculatePodsInternal(coverKey, pod, stablecoinIn);
  }

  /**
   * @dev Calculates the amount of stablecoin units to receive for the given amount of PODs to redeem
   *
   * @param coverKey Enter the cover for which you want to calculate PODs
   * @param podsToBurn Enter the amount in the POD units to redeem
   *
   * @return Returns the units of stablecoins to redeem if the specified PODs were burned.
   * Be warned that this value may change based on the cover's vault usage.
   *
   */
  function calculateLiquidityImplementation(bytes32 coverKey, uint256 podsToBurn) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    address pod = msg.sender;
    return s.calculateLiquidityInternal(coverKey, pod, podsToBurn);
  }

  /**
   * @dev Returns the stablecoin balance of this vault
   * This also includes amounts lent out in lending strategies by this vault
   *
   * Warning: this function does not validate the cover key supplied.
   *
   * @param coverKey Enter the cover for which you want to get the stablecoin balance
   */
  function getStablecoinBalanceOfImplementation(bytes32 coverKey) external view override returns (uint256) {
    s.senderMustBeVaultContract(coverKey);
    return s.getStablecoinOwnedByVaultInternal(coverKey);
  }

  /**
   * @dev Gets information of a given vault by the cover key
   *
   * Warning: this function does not validate the cover key and account supplied.
   *
   * @param coverKey Specify cover key to obtain the info of
   * @param you The address for which the info will be customized
   *
   */
  function getInfoImplementation(bytes32 coverKey, address you) external view override returns (IVault.VaultInfoType memory) {
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
