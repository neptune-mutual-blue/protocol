// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity 0.8.0;
import "../interfaces/IStore.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./NTransferUtilV2.sol";
import "./ProtoUtilV1.sol";
import "./PolicyHelperV1.sol";
import "./StoreKeyUtil.sol";
import "./ValidationLibV1.sol";
import "./RegistryLibV1.sol";
import "./CoverUtilV1.sol";
import "./RoutineInvokerLibV1.sol";
import "openzeppelin-solidity/contracts/interfaces/IERC3156FlashLender.sol";

library VaultLibV1 {
  using NTransferUtilV2 for IERC20;
  using ProtoUtilV1 for IStore;
  using PolicyHelperV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;
  using RegistryLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using RoutineInvokerLibV1 for IStore;

  /**
   * @dev Calculates the amount of PODS to mint for the given amount of liquidity to transfer
   */
  function calculatePodsInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    uint256 liquidityToAdd
  ) public view returns (uint256) {
    uint256 balance = getStablecoinBalanceOfInternal(s, coverKey);
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
   *
   * The Vault contract lends out liquidity to external protocols to maximize reward
   * regularly. But it also withdraws periodically to receive back the loaned amount
   * with interest. In other words, the Vault contract continuously supplies
   * available liquidity to lending protocols and withdraws during a fixed interval.
   * For example, supply during `180-day lending period` and allow withdrawals
   * during `7-day withdrawal period`.
   */
  function calculateLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    uint256 podsToBurn
  ) public view returns (uint256) {
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
   * @param values[4] myPodBalance --> Your POD Balance
   * @param values[5] myDeposits --> Sum of your deposits (in stablecoin)
   * @param values[6] myWithdrawals --> Sum of your withdrawals  (in stablecoin)
   * @param values[7] myShare --> My share of the liquidity pool (in stablecoin)
   * @param values[8] withdrawalOpen --> The timestamp when withdrawals are opened
   * @param values[9] withdrawalClose --> The timestamp when withdrawals are closed again
   */
  function getInfoInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address you
  ) external view returns (uint256[] memory values) {
    values = new uint256[](11);

    values[0] = IERC20(pod).totalSupply(); // Total PODs in existence
    values[1] = getStablecoinBalanceOfInternal(s, coverKey);
    values[2] = getLendingTotal(s, coverKey); //  Stablecoins lent outside of the protocol
    values[3] = s.getReassuranceAmountInternal(coverKey); // Total reassurance for this cover
    values[4] = IERC20(pod).balanceOf(you); // Your POD Balance
    values[5] = _getCoverLiquidityAddedInternal(s, coverKey, you); // Sum of your deposits (in stablecoin)
    values[6] = _getCoverLiquidityRemovedInternal(s, coverKey, you); // Sum of your withdrawals  (in stablecoin)
    values[7] = calculateLiquidityInternal(s, coverKey, pod, stablecoin, values[5]); //  My share of the liquidity pool (in stablecoin)
    values[8] = s.getUintByKey(RoutineInvokerLibV1.getNextWithdrawalStartKey(coverKey));
    values[9] = s.getUintByKey(RoutineInvokerLibV1.getNextWithdrawalEndKey(coverKey));
  }

  function _getCoverLiquidityAddedInternal(
    IStore s,
    bytes32 coverKey,
    address you
  ) private view returns (uint256) {
    return s.getUintByKey(CoverUtilV1.getCoverLiquidityAddedKey(coverKey, you));
  }

  function _getCoverLiquidityRemovedInternal(
    IStore s,
    bytes32 coverKey,
    address you
  ) private view returns (uint256) {
    return s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_REMOVED, coverKey, you);
  }

  function getLendingTotal(IStore s, bytes32 coverKey) public view returns (uint256) {
    return s.getUintByKey(CoverUtilV1.getCoverTotalLentKey(coverKey));
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param account Specify the account on behalf of which the liquidity is being added.
   * @param amount Enter the amount of liquidity token to supply.
   * @param npmStakeToAdd Enter the amount of NPM token to stake.
   */
  function addLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address account,
    uint256 amount,
    uint256 npmStakeToAdd
  ) external returns (uint256) {
    // @suppress-address-trust-issue, @suppress-malicious-erc20 The address `stablecoin` can be trusted here because we are ensuring it matches with the protocol stablecoin address.
    // @suppress-address-trust-issue The address `account` can be trusted here because we are not treating it as a contract (even it were).
    require(account != address(0), "Invalid account");
    require(stablecoin == s.getStablecoin(), "Vault migration required");

    // Update values
    _updateNpmStake(s, coverKey, account, npmStakeToAdd);
    _updateCoverLiquidity(s, coverKey, account, amount);

    uint256 podsToMint = calculatePodsInternal(s, coverKey, pod, amount);

    IERC20(stablecoin).ensureTransferFrom(account, address(this), amount);
    IERC20(s.getNpmTokenAddress()).ensureTransferFrom(account, address(this), npmStakeToAdd);

    return podsToMint;
  }

  function _updateNpmStake(
    IStore s,
    bytes32 coverKey,
    address account,
    uint256 amount
  ) private {
    uint256 myPreviousStake = _getMyNpmStake(s, coverKey, account);
    require(amount + myPreviousStake >= s.getMinStakeToAddLiquidity(), "Insufficient stake");

    if (amount > 0) {
      s.addUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey), amount); // Total stake
      s.addUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, account), amount); // Your stake
    }
  }

  function _updateCoverLiquidity(
    IStore s,
    bytes32 coverKey,
    address account,
    uint256 amount
  ) private {
    s.addUintByKey(CoverUtilV1.getCoverLiquidityKey(coverKey), amount); // Total liquidity
    s.addUintByKey(CoverUtilV1.getCoverLiquidityAddedKey(coverKey, account), amount); // Your liquidity
  }

  function _getMyNpmStake(
    IStore s,
    bytes32 coverKey,
    address account
  ) private view returns (uint256 myStake) {
    (, myStake) = getCoverNpmStake(s, coverKey, account);
  }

  function getCoverNpmStake(
    IStore s,
    bytes32 coverKey,
    address account
  ) public view returns (uint256 totalStake, uint256 myStake) {
    totalStake = s.getUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey));
    myStake = s.getUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, account));
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
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external returns (uint256) {
    // @suppress-address-trust-issue, @suppress-malicious-erc20 The address `pod` although can only
    // come from VaultBase, we still need to ensure if it is a protocol member.
    // Check `_redeemPods` for more info.
    s.mustHaveNormalCoverStatus(coverKey);
    s.mustBeDuringWithdrawalPeriod(coverKey);

    // Redeem the PODs and receive DAI
    uint256 releaseAmount = _redeemPods(s, coverKey, pod, podsToRedeem);

    // Unstake NPM tokens
    if (npmStakeToRemove > 0) {
      _unStakeNpm(s, coverKey, npmStakeToRemove, exit);
      IERC20(s.getNpmTokenAddress()).ensureTransfer(msg.sender, npmStakeToRemove);
    }

    s.updateStateAndLiquidity(coverKey);
    return releaseAmount;
  }

  function _unStakeNpm(
    IStore s,
    bytes32 coverKey,
    uint256 amount,
    bool exit
  ) private {
    uint256 remainingStake = _getMyNpmStake(s, coverKey, msg.sender);
    uint256 minStakeToMaintain = exit ? 0 : s.getMinStakeToAddLiquidity();

    require(remainingStake - amount >= minStakeToMaintain, "Can't go below min stake");

    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey), amount); // Total stake
    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, msg.sender), amount); // Your stake
  }

  function _redeemPods(
    IStore s,
    bytes32 coverKey,
    address pod,
    uint256 podsToRedeem
  ) private returns (uint256) {
    if (podsToRedeem == 0) {
      return 0;
    }

    s.mustBeProtocolMember(pod);
    address stablecoin = s.getStablecoin();

    uint256 available = s.getStablecoinBalanceOfCoverPoolInternal(coverKey);
    uint256 releaseAmount = calculateLiquidityInternal(s, coverKey, pod, stablecoin, podsToRedeem);

    // You may need to wait till active policies expire
    require(available >= releaseAmount, "Insufficient balance, wait till policy expiry."); // solhint-disable-line

    // Update values
    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityKey(coverKey), releaseAmount);
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_REMOVED, coverKey, msg.sender, releaseAmount);

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
  function getFlashFeesInternal(
    IStore s,
    address token,
    uint256 amount
  ) public view returns (uint256 fee, uint256 protocolFee) {
    address stablecoin = s.getStablecoin();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    /*
    https://eips.ethereum.org/EIPS/eip-3156

    The flashFee function MUST return the fee charged for a loan of amount token.
    If the token is not supported flashFee MUST revert.
    */
    require(stablecoin == token, "Unsupported token");

    uint256 rate = _getFlashLoanFeeRateInternal(s);
    uint256 protocolRate = _getProtocolFlashLoanFeeRateInternal(s);

    fee = (amount * rate) / ProtoUtilV1.MULTIPLIER;
    protocolFee = (fee * protocolRate) / ProtoUtilV1.MULTIPLIER;
  }

  function getFlashFeeInternal(
    IStore s,
    address token,
    uint256 amount
  ) external view returns (uint256) {
    (uint256 fee, ) = getFlashFeesInternal(s, token, amount);
    return fee;
  }

  function _getFlashLoanFeeRateInternal(IStore s) private view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE);
  }

  function _getProtocolFlashLoanFeeRateInternal(IStore s) private view returns (uint256) {
    return s.getUintByKey(ProtoUtilV1.NS_COVER_LIQUIDITY_FLASH_LOAN_FEE_PROTOCOL);
  }

  /**
   * @dev The amount of currency available to be lent.
   * @param token The loan currency.
   * @return The amount of `token` that can be borrowed.
   */
  function getMaxFlashLoanInternal(IStore s, address token) external view returns (uint256) {
    address stablecoin = s.getStablecoin();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

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

  function getPodTokenNameInternal(bytes32 coverKey) external pure returns (string memory) {
    return string(abi.encodePacked(string(abi.encodePacked(coverKey)), "-pod"));
  }

  function transferToStrategyInternal(
    IStore s,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external {
    // @suppress-malicious-erc20 @note: token should be checked on the calling contract
    token.ensureTransfer(msg.sender, amount);

    _addToStrategyOut(s, coverKey, token, amount);
    _addToSpecificStrategyOut(s, coverKey, strategyName, token, amount);
  }

  function _addToStrategyOut(
    IStore s,
    bytes32 coverKey,
    IERC20 token,
    uint256 amountToAdd
  ) private {
    bytes32 k = _getStrategyOutKey(coverKey, token);
    s.addUintByKey(k, amountToAdd);
  }

  function _clearStrategyOut(
    IStore s,
    bytes32 coverKey,
    IERC20 token
  ) private {
    bytes32 k = _getStrategyOutKey(coverKey, token);
    s.deleteUintByKey(k);
  }

  function _addToSpecificStrategyOut(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    IERC20 token,
    uint256 amountToAdd
  ) private {
    bytes32 k = _getSpecificStrategyOutKey(coverKey, strategyName, token);
    s.addUintByKey(k, amountToAdd);
  }

  function _clearSpecificStrategyOut(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    IERC20 token
  ) private {
    bytes32 k = _getSpecificStrategyOutKey(coverKey, strategyName, token);
    s.deleteUintByKey(k);
  }

  function _getStrategyOutKey(bytes32 coverKey, IERC20 token) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_STRATEGY_OUT, coverKey, token));
  }

  function _getSpecificStrategyOutKey(
    bytes32 coverKey,
    bytes32 strategyName,
    IERC20 token
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(ProtoUtilV1.NS_VAULT_STRATEGY_OUT, coverKey, strategyName, token));
  }

  function receiveFromStrategyInternal(
    IStore s,
    IERC20 token,
    bytes32 coverKey,
    bytes32 strategyName,
    uint256 amount
  ) external {
    // @suppress-malicious-erc20 token should be checked on the calling contract
    token.ensureTransferFrom(msg.sender, address(this), amount);

    _clearStrategyOut(s, coverKey, token);
    _clearSpecificStrategyOut(s, coverKey, strategyName, token);
  }

  function getAmountInStrategies(
    IStore s,
    bytes32 coverKey,
    IERC20 token
  ) public view returns (uint256) {
    bytes32 k = _getStrategyOutKey(coverKey, token);
    return s.getUintByKey(k);
  }

  function getAmountInStrategy(
    IStore s,
    bytes32 coverKey,
    bytes32 strategyName,
    IERC20 token
  ) external view returns (uint256) {
    bytes32 k = _getSpecificStrategyOutKey(coverKey, strategyName, token);
    return s.getUintByKey(k);
  }

  function getStablecoinBalanceOfInternal(IStore s, bytes32 coverKey) public view returns (uint256) {
    IERC20 stablecoin = IERC20(s.getStablecoin());

    uint256 balance = stablecoin.balanceOf(address(this));
    uint256 inStrategies = getAmountInStrategies(s, coverKey, stablecoin);

    return balance + inStrategies;
  }

  /**
   * @dev Initiate a flash loan.
   * @param receiver The receiver of the tokens in the loan, and the receiver of the callback.
   * @param token The loan currency.
   * @param amount The amount of tokens lent.
   * @param data Arbitrary data structure, intended to contain user-defined parameters.
   */
  function flashLoanInternal(
    IStore s,
    IERC3156FlashBorrower receiver,
    bytes32 key,
    address token,
    uint256 amount,
    bytes calldata data
  ) external returns (uint256) {
    // @suppress-address-trust-issue, @suppress-malicious-erc20 `stablecoin` can't be manipulated via user input.
    IERC20 stablecoin = IERC20(s.getStablecoin());
    (uint256 fee, uint256 protocolFee) = getFlashFeesInternal(s, token, amount);
    uint256 previousBalance = stablecoin.balanceOf(address(this));

    require(address(stablecoin) == token, "Unknown token");
    require(amount > 0, "Loan too small");
    require(fee > 0, "Fee too little");
    require(previousBalance >= amount, "Balance insufficient");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, key, true);

    stablecoin.ensureTransfer(address(receiver), amount);
    require(receiver.onFlashLoan(msg.sender, token, amount, fee, data) == keccak256("ERC3156FlashBorrower.onFlashLoan"), "IERC3156: Callback failed");
    stablecoin.ensureTransferFrom(address(receiver), address(this), amount + fee);
    stablecoin.ensureTransfer(s.getTreasury(), protocolFee);

    uint256 finalBalance = stablecoin.balanceOf(address(this));
    require(finalBalance >= previousBalance + fee, "Access is denied");

    s.setBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, key, false);

    s.updateStateAndLiquidity(key);

    return fee;
  }
}
