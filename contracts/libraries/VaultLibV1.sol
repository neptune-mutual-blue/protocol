// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./NTransferUtilV2.sol";
import "./ProtoUtilV1.sol";
import "./StoreKeyUtil.sol";
import "./ValidationLibV1.sol";
import "./RegistryLibV1.sol";
import "./CoverUtilV1.sol";

library VaultLibV1 {
  using NTransferUtilV2 for IERC20;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using RegistryLibV1 for IStore;
  using CoverUtilV1 for IStore;

  /**
   * @dev Calculates the amount of PODS to mint for the given amount of liquidity to transfer
   */
  function calculatePodsInternal(
    address pod,
    address stablecoin,
    uint256 liquidityToAdd
  ) public view returns (uint256) {
    uint256 balance = IERC20(stablecoin).balanceOf(address(this));
    uint256 podSupply = IERC20(pod).totalSupply();

    // This smart contract contains stablecoins without liquidity provider contribution
    if (podSupply == 0 && balance > 0) {
      revert("Liquidity/POD mismatch");
    }

    if (balance > 0) {
      return (IERC20(pod).totalSupply() * liquidityToAdd) / balance;
    }

    return liquidityToAdd;
  }

  /**
   * @dev Calculates the amount of liquidity to transfer for the given amount of PODs to burn.
   * todo Need to revisit this later and fix the following issue
   * https://github.com/neptune-mutual/protocol/issues/23
   *
   * As it seems, the function `calculateLiquidityInternal` does not consider that
   * the balance of the-then vault may not or most likely will not be accurate.
   * Or that the protocol could have lent out some portion of the liquidity to one
   * or several external protocols to maximize rewards given to the liquidity providers.
   *
   * # Proposal 1: By Tracking Liquidity Lent Out
   *
   * It’s easy to keep track of how much liquidity was lent elsewhere and
   * add that amount to come up with the total liquidity of the vault at any time.
   * This solution allows liquidity providers to view their final balance and redeem
   * their PODs anytime and receive withdrawals.
   *
   * **The Problems of This Approach**
   * Imagine an external lending protocol we sent liquidity to is attacked and exploited
   * and became unable to pay back the amount with interest. This situation, if it arises,
   * suggests a design flaw. As liquidity providers can receive their share of
   * the liquidity and rewards without bearing any loss, many will jump in
   * to withdraw immediately.
   *
   * If this happens and most likely will, the liquidity providers who kept their liquidity
   * longer in the protocol will now collectively bear the loss. Then again, `tracking liquidity`
   * becomes much more complex because we not only need to track the balance of
   * the-then vault contract but several other things like `external lendings`
   * and `lending defaults.`
   *
   * # Proposal 2: By Creating a `Withdrawal Window`
   *
   * The Vault contract can lend out liquidity to external lending protocols to maximize reward
   * regularly. But it also MUST WITHDRAW PERIODICALLY to receive back the loaned amount
   * with interest. In other words, the Vault contract continuously supplies
   * available liquidity to lending protocols and withdraws during a fixed interval.
   * For example, supply during `180-day lending period` and allow withdrawals
   * during `7-day withdrawal period`.
   *
   * This proposal solves the issue of `Proposal 1` as the protocol treats every
   * liquidity provider the same. The providers will be able to withdraw their
   * proportional share of liquidity during the `withdrawal period` without
   * getting any additional benefit or alone suffering financial loss
   * based on how quick or late they were to withdraw.
   *
   * Another advantage of this proposal is that the issue reported
   * is no longer a bug but a feature.
   *
   * **The Problems of This Approach**
   * The problem with this approach is the fixed period when liquidity providers
   * can withdraw. If LPs do not redeem their liquidity during the `withdrawal period,`
   * they will have to wait for another cycle until the `lending period` is over.
   *
   * This solution would not be a problem for liquidity providers with a
   * long-term mindset who understand the risks of `risk pooling.` A short-term-focused
   * liquidity provider would want to see a `90-day` or shorter lending duration
   * that enables them to pool liquidity in and out periodically based on their preference.
   */
  function calculateLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    uint256 podsToBurn
  ) public view returns (uint256) {
    /***************************************************************************
    @todo Need to revisit this later and fix the following issue
    https://github.com/neptune-mutual/protocol/issues/23
    ***************************************************************************/
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey) == false, "On flash loan, please try again");

    uint256 contractStablecoinBalance = IERC20(stablecoin).balanceOf(address(this));
    return (contractStablecoinBalance * podsToBurn) / IERC20(pod).totalSupply();
  }

  /**
   * @dev Gets information of a given vault by the cover key
   * @param s Provide a store instance
   * @param coverKey Specify cover key to obtain the info of.
   * @param pod Provide the address of the POD
   * @param stablecoin Provide the address of the Vault stablecoin
   * @param you The address for which the info will be customized
   * @param values[0] totalPods --> Total PODs in existence
   * @param values[1] balance --> Stablecoins held in the vault
   * @param values[2] extendedBalance --> Stablecoins lent outside of the protocol
   * @param values[3] totalReassurance -- > Total reassurance for this cover
   * @param values[4] lockup --> Deposit lockup period
   * @param values[5] myPodBalance --> Your POD Balance
   * @param values[6] myDeposits --> Sum of your deposits (in stablecoin)
   * @param values[7] myWithdrawals --> Sum of your withdrawals  (in stablecoin)
   * @param values[8] myShare --> My share of the liquidity pool (in stablecoin)
   * @param values[9] releaseDate --> My liquidity release date
   */
  function getInfoInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address you
  ) external view returns (uint256[] memory values) {
    values = new uint256[](10);

    values[0] = IERC20(pod).totalSupply(); // Total PODs in existence
    values[1] = IERC20(stablecoin).balanceOf(address(this)); // Stablecoins in the pool
    values[2] = getLendingTotal(s, coverKey); //  Stablecoins lent outside of the protocol
    values[3] = s.getReassuranceAmountInternal(coverKey); // Total reassurance for this cover
    values[4] = s.getMinLiquidityPeriod(); // Lockup period
    values[5] = IERC20(pod).balanceOf(you); // Your POD Balance
    values[6] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_ADDED, coverKey, you); // Sum of your deposits (in stablecoin)
    values[7] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_REMOVED, coverKey, you); // Sum of your withdrawals  (in stablecoin)
    values[8] = calculateLiquidityInternal(s, coverKey, pod, stablecoin, values[1]); //  My share of the liquidity pool (in stablecoin)
    values[9] = s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, you); // My liquidity release date
  }

  function getLendingTotal(IStore s, bytes32 coverKey) public view returns (uint256) {
    // @todo Update `NS_COVER_STABLECOIN_LENT_TOTAL` when building lending
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_STABLECOIN_LENT_TOTAL, coverKey);
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param account Specify the account on behalf of which the liquidity is being added.
   * @param amount Enter the amount of liquidity token to supply.
   */
  function addLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address account,
    uint256 amount,
    bool initialLiquidity
  ) external returns (uint256) {
    // @suppress-address-trust-issue The address `stablecoin` can be trusted here because we are ensuring it matches with the protocol stablecoin address.
    // @suppress-address-trust-issue The address `account` can be trusted here because we are not treating it as a contract (even it were).
    require(account != address(0), "Invalid account");
    require(stablecoin == s.getStablecoin(), "Vault migration required");

    // Update values
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, amount); // Total liquidity
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_ADDED, coverKey, account, amount); // Your liquidity

    uint256 minLiquidityPeriod = s.getMinLiquidityPeriod();
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, account, block.timestamp + minLiquidityPeriod); // solhint-disable-line

    uint256 podsToMint = calculatePodsInternal(pod, stablecoin, amount);

    if (initialLiquidity == false) {
      // First deposit the tokens
      IERC20(stablecoin).ensureTransferFrom(account, address(this), amount);
    }

    return podsToMint;
  }

  /**
   * @dev Removes liquidity from the specified cover contract
   * @param coverKey Enter the cover key
   * @param podsToRedeem Enter the amount of liquidity token to remove.
   */
  function removeLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    uint256 podsToRedeem
  ) external returns (uint256) {
    // @suppress-address-trust-issue The address `pod` although can only come from VaultBase, we still need to ensure if it is a protocol member.
    s.mustBeValidCover(coverKey);
    s.mustBeProtocolMember(pod);

    address stablecoin = s.getStablecoin();

    uint256 available = s.getPolicyContract().getCoverable(coverKey);
    uint256 releaseAmount = calculateLiquidityInternal(s, coverKey, pod, stablecoin, podsToRedeem);

    /*
     * You need to wait for the policy term to expire before you can withdraw
     * your liquidity.
     */
    require(available >= releaseAmount, "Insufficient balance"); // Insufficient balance. Please wait for the policy to expire.
    require(s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender) > 0, "Invalid request");
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender), "Withdrawal too early"); // solhint-disable-line

    // Update values
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, releaseAmount);
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_REMOVED, coverKey, msg.sender, releaseAmount);

    IERC20(pod).ensureTransferFrom(msg.sender, address(this), podsToRedeem);
    IERC20(stablecoin).ensureTransfer(msg.sender, releaseAmount);

    return releaseAmount;
  }

  /**
   * @dev The fee to be charged for a given loan.
   * @param s Provide an instance of the store
   * @param token The loan currency.
   * @param amount The amount of tokens lent.
   * @param fee The amount of `token` to be charged for the loan, on top of the returned principal.
   * @param protocolFee The fee received by the protocol
   */
  function getFlashFeeInternal(
    IStore s,
    address token,
    uint256 amount
  ) external view returns (uint256 fee, uint256 protocolFee) {
    address stablecoin = s.getStablecoin();

    /*
    https://eips.ethereum.org/EIPS/eip-3156

    The flashFee function MUST return the fee charged for a loan of amount token.
    If the token is not supported flashFee MUST revert.
    */
    require(stablecoin == token, "Unsupported token");

    uint256 rate = s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE);
    uint256 protocolRate = s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL);

    fee = (amount * rate) / ProtoUtilV1.PERCENTAGE_DIVISOR;
    protocolFee = (fee * protocolRate) / ProtoUtilV1.PERCENTAGE_DIVISOR;
  }

  function getProtocolFlashLoanFee(IStore s) external view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL);
  }

  /**
   * @dev The amount of currency available to be lent.
   * @param token The loan currency.
   * @return The amount of `token` that can be borrowed.
   */
  function getMaxFlashLoanInternal(IStore s, address token) external view returns (uint256) {
    address stablecoin = s.getStablecoin();

    if (stablecoin == token) {
      return IERC20(stablecoin).balanceOf(address(this));
    }

    /*
    https://eips.ethereum.org/EIPS/eip-3156

    The maxFlashLoan function MUST return the maximum loan possible for token.
    If a token is not currently supported maxFlashLoan MUST return 0, instead of reverting.    
    */
    return 0;
  }
}
