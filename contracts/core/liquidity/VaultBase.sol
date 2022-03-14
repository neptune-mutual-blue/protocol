// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../Recoverable.sol";
import "../../interfaces/IVault.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/VaultLibV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../../libraries/StrategyLibV1.sol";

/**
 * @title Vault POD (Proof of Deposit)
 * @dev The VaultPod has `_mintPods` and `_redeemPods` features which enables
 * POD minting and burning on demand. <br /> <br />
 *
 * **How Does This Work?**
 *
 * When you add liquidity to the Vault,
 * PODs are minted representing your proportional share of the pool.
 * Similarly, when you redeem your PODs, you get your proportional
 * share of the Vault liquidity back, burning the PODs.
 */
abstract contract VaultBase is IVault, Recoverable, ERC20 {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using VaultLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using StrategyLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;
  using RoutineInvokerLibV1 for IStore;

  bytes32 public override key;
  address public override lqt;
  uint256 private _transferToStrategyEntry = 0;
  uint256 private _receiveFromStrategyEntry = 0;

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   * @param coverKey Enter the cover key or cover this contract is related to
   * @param liquidityToken Provide the liquidity token instance for this Vault
   */
  constructor(
    IStore store,
    bytes32 coverKey,
    IERC20 liquidityToken
  ) ERC20(VaultLibV1.getPodTokenNameInternal(coverKey), "POD") Recoverable(store) {
    key = coverKey;
    lqt = address(liquidityToken);
  }

  function transferGovernance(
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.callerMustBeClaimsProcessorContract();
    require(coverKey == key, "Forbidden");

    // @suppress-malicious-erc20 `lqt` can't be manipulated via user input.
    IERC20(lqt).ensureTransfer(to, amount);
    emit GovernanceTransfer(to, amount);
  }

  function transferToStrategy(
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override {
    // @suppress-reentrancy Custom reentrancy guard implemented
    require(_transferToStrategyEntry == 0, "Access is denied");
    _transferToStrategyEntry = 1;

    s.mustNotBePaused();
    s.callerMustBeStrategyContract();
    require(coverKey == key, "Forbidden");

    // @suppress-malicious-erc20 `token` can only be specified by strategy contract.
    s.transferToStrategyInternal(token, coverKey, strategyName, amount);
    emit StrategyTransfer(address(token), msg.sender, strategyName, amount);
    _transferToStrategyEntry = 0;
  }

  function receiveFromStrategy(
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external override {
    // @suppress-reentrancy Custom reentrancy guard implemented
    require(_receiveFromStrategyEntry == 0, "Access is denied");
    _receiveFromStrategyEntry = 1;

    s.mustNotBePaused();
    s.callerMustBeStrategyContract();
    require(coverKey == key, "Forbidden");

    // @suppress-malicious-erc20 `token` can only be specified by strategy contract.
    (uint256 income, uint256 loss) = s.receiveFromStrategyInternal(token, coverKey, strategyName, amount);

    emit StrategyReceipt(address(token), msg.sender, strategyName, amount, income, loss);
    _receiveFromStrategyEntry = 0;
  }

  /**
   * @dev Returns the stablecoin balance of this vault
   * This also includes amounts lent out in lending strategies
   */
  function getStablecoinBalanceOf() external view override returns (uint256) {
    return s.getStablecoinBalanceOfInternal(key);
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of liquidity token to supply.
   * @param npmStakeToAdd Enter the amount of NPM token to stake.
   */
  function addLiquidity(
    bytes32 coverKey,
    uint256 amount,
    uint256 npmStakeToAdd
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();
    s.mustHaveNormalCoverStatus(key);

    uint256 podsToMint = s.addLiquidityInternal(coverKey, address(this), lqt, msg.sender, amount, npmStakeToAdd);
    super._mint(msg.sender, podsToMint);

    s.updateStateAndLiquidity(key);

    emit PodsIssued(msg.sender, podsToMint, amount);
  }

  /**
   * @dev Removes liquidity from the specified cover contract
   * @param coverKey Enter the cover key
   * @param podsToRedeem Enter the amount of pods to redeem
   * @param npmStakeToRemove Enter the amount of NPM stake to remove.
   */
  function removeLiquidity(
    bytes32 coverKey,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();

    require(coverKey == key, "Forbidden");
    uint256 released = s.removeLiquidityInternal(coverKey, address(this), podsToRedeem, npmStakeToRemove, exit);

    emit PodsRedeemed(msg.sender, podsToRedeem, released);
  }

  /**
   * @dev Calculates the amount of PODS to mint for the given amount of liquidity to transfer
   */
  function calculatePods(uint256 forStablecoinUnits) external view override returns (uint256) {
    return s.calculatePodsInternal(key, address(this), forStablecoinUnits);
  }

  /**
   * @dev Calculates the amount of stablecoins to withdraw for the given amount of PODs to redeem
   */
  function calculateLiquidity(uint256 podsToBurn) external view override returns (uint256) {
    return s.calculateLiquidityInternal(key, address(this), lqt, podsToBurn);
  }

  /**
   * @dev Gets information of a given vault by the cover key
   * @param you The address for which the info will be customized
   * @param values[0] totalPods --> Total PODs in existence
   * @param values[1] balance --> Stablecoins held in the vault
   * @param values[2] extendedBalance --> Stablecoins lent outside of the protocol
   * @param values[3] totalReassurance -- > Total reassurance for this cover
   * @param values[4] myPodBalance --> Your POD Balance
   * @param values[5] myDeposits --> Sum of your deposits (in stablecoin)
   * @param values[6] myWithdrawals --> Sum of your withdrawals  (in stablecoin)
   * @param values[7] myShare --> My share of the liquidity pool (in stablecoin)
   * @param values[8] withdrawalOpen --> The timestamp when withdrawals are opened
   * @param values[9] withdrawalClose --> The timestamp when withdrawals are closed again
   */
  function getInfo(address you) external view override returns (uint256[] memory values) {
    return s.getInfoInternal(key, address(this), lqt, you);
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
    return ProtoUtilV1.CNAME_LIQUIDITY_VAULT;
  }
}
