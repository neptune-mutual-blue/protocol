// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/interfaces/IERC3156FlashLender.sol";
import "./ValidationLibV1.sol";

library VaultLibV1 {
  using CoverUtilV1 for IStore;
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using RoutineInvokerLibV1 for IStore;
  using StoreKeyUtil for IStore;
  using StrategyLibV1 for IStore;

  // Before withdrawing, wait for the following number of blocks after deposit
  uint256 public constant WITHDRAWAL_HEIGHT_OFFSET = 1;

  /**
   * @dev Calculates the amount of PODS to mint for the given amount of liquidity to transfer
   */
  function calculatePodsInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    uint256 liquidityToAdd
  ) public view returns (uint256) {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey) == false, "On flash loan, please try again");

    uint256 balance = s.getStablecoinOwnedByVaultInternal(coverKey);
    uint256 podSupply = IERC20(pod).totalSupply();
    uint256 stablecoinPrecision = s.getStablecoinPrecision();

    // This smart contract contains stablecoins without liquidity provider contribution.
    // This can happen if someone wants to create a nuisance by sending stablecoin
    // to this contract immediately after deployment.
    if (podSupply == 0 && balance > 0) {
      revert("Liquidity/POD mismatch");
    }

    if (balance > 0) {
      return (podSupply * liquidityToAdd) / balance;
    }

    return (liquidityToAdd * ProtoUtilV1.POD_PRECISION) / stablecoinPrecision;
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
    uint256 podsToBurn
  ) public view returns (uint256) {
    require(s.getBoolByKeys(ProtoUtilV1.NS_COVER_HAS_FLASH_LOAN, coverKey) == false, "On flash loan, please try again");

    uint256 balance = s.getStablecoinOwnedByVaultInternal(coverKey);
    uint256 podSupply = IERC20(pod).totalSupply();

    return (balance * podsToBurn) / podSupply;
  }

  /**
   * @dev Gets information of a given vault by the cover key
   * @param s Provide a store instance
   * @param coverKey Specify cover key to obtain the info of.
   * @param pod Provide the address of the POD
   * @param you The address for which the info will be customized
   */
  function getInfoInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address you
  ) external view returns (IVault.VaultInfoType memory info) {
    info.totalPods = IERC20(pod).totalSupply(); // Total PODs in existence
    info.balance = s.getStablecoinOwnedByVaultInternal(coverKey); // Stablecoins held in the vault
    info.extendedBalance = s.getAmountInStrategies(coverKey, s.getStablecoin()); //  Stablecoins lent outside of the protocol
    info.totalReassurance = s.getReassuranceAmountInternal(coverKey); // Total reassurance for this cover
    info.myPodBalance = IERC20(pod).balanceOf(you); // Your POD Balance
    info.myShare = calculateLiquidityInternal(s, coverKey, pod, info.myPodBalance); //  My share of the liquidity pool (in stablecoin)
    info.withdrawalOpen = s.getUintByKey(RoutineInvokerLibV1.getNextWithdrawalStartKey(coverKey)); // The timestamp when withdrawals are opened
    info.withdrawalClose = s.getUintByKey(RoutineInvokerLibV1.getNextWithdrawalEndKey(coverKey)); // The timestamp when withdrawals are closed again
  }

  /**
   * @dev Called before adding liquidity to the specified cover contract
   *
   * @custom:suppress-malicious-erc The address `stablecoin` can be trusted here because we are ensuring it matches with the protocol stablecoin address.
   * @custom:suppress-address-trust-issue The address `stablecoin` can be trusted here because we are ensuring it matches with the protocol stablecoin address.
   *
   * @param coverKey Enter the cover key
   * @param account Specify the account on behalf of which the liquidity is being added.
   * @param amount Enter the amount of liquidity token to supply.
   * @param npmStakeToAdd Enter the amount of NPM token to stake.
   */
  function preAddLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address account,
    uint256 amount,
    uint256 npmStakeToAdd
  ) external returns (uint256 podsToMint, uint256 myPreviousStake) {
    require(account != address(0), "Invalid account");

    // Update values
    myPreviousStake = _updateNpmStake(s, coverKey, account, npmStakeToAdd);
    podsToMint = calculatePodsInternal(s, coverKey, pod, amount);

    _updateLastBlock(s, coverKey);
  }

  function _updateLastBlock(IStore s, bytes32 coverKey) private {
    s.setUintByKey(CoverUtilV1.getLastDepositHeightKey(coverKey), block.number);
  }

  function _updateNpmStake(
    IStore s,
    bytes32 coverKey,
    address account,
    uint256 amount
  ) private returns (uint256 myPreviousStake) {
    myPreviousStake = _getMyNpmStake(s, coverKey, account);
    require(amount + myPreviousStake >= s.getMinStakeToAddLiquidity(), "Insufficient stake");

    if (amount > 0) {
      s.addUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey), amount); // Total stake
      s.addUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, account), amount); // Your stake
    }
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

  function mustHaveNoBalanceInStrategies(
    IStore s,
    bytes32 coverKey,
    address stablecoin
  ) external view {
    require(s.getAmountInStrategies(coverKey, stablecoin) == 0, "Strategy balance is not zero");
  }

  function mustMaintainBlockHeightOffset(IStore s, bytes32 coverKey) external view {
    uint256 lastDeposit = s.getUintByKey(CoverUtilV1.getLastDepositHeightKey(coverKey));
    require(block.number > lastDeposit + WITHDRAWAL_HEIGHT_OFFSET, "Please wait a few blocks");
  }

  /**
   * @dev Removes liquidity from the specified cover contract
   *
   * @custom:suppress-malicious-erc The address `pod` although can only come from VaultBase,
   * we still need to ensure if it is a protocol member. Check `_redeemPodCalculation` for more info.
   * @custom:suppress-address-trust-issue The address `pod` can't be trusted and therefore needs to be checked
   * if it is a protocol member.
   *
   * @param coverKey Enter the cover key
   * @param podsToRedeem Enter the amount of liquidity token to remove.
   */
  function preRemoveLiquidityInternal(
    IStore s,
    bytes32 coverKey,
    address pod,
    address account,
    uint256 podsToRedeem,
    uint256 npmStakeToRemove,
    bool exit
  ) external returns (address stablecoin, uint256 releaseAmount) {
    stablecoin = s.getStablecoin();

    // Redeem the PODs and receive DAI
    releaseAmount = _redeemPodCalculation(s, coverKey, pod, podsToRedeem);

    ValidationLibV1.mustNotExceedStablecoinThreshold(s, releaseAmount);
    GovernanceUtilV1.mustNotExceedNpmThreshold(npmStakeToRemove);

    // Unstake NPM tokens
    if (npmStakeToRemove > 0) {
      _unStakeNpm(s, account, coverKey, npmStakeToRemove, exit);
    }
  }

  function _unStakeNpm(
    IStore s,
    address account,
    bytes32 coverKey,
    uint256 amount,
    bool exit
  ) private {
    uint256 remainingStake = _getMyNpmStake(s, coverKey, account);
    uint256 minStakeToMaintain = s.getMinStakeToAddLiquidity();

    if (exit) {
      require(remainingStake == amount, "Invalid NPM stake to exit");
    } else {
      require(remainingStake - amount >= minStakeToMaintain, "Can't go below min stake");
    }

    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityStakeKey(coverKey), amount); // Total stake
    s.subtractUintByKey(CoverUtilV1.getCoverLiquidityStakeIndividualKey(coverKey, account), amount); // Your stake
  }

  function _redeemPodCalculation(
    IStore s,
    bytes32 coverKey,
    address pod,
    uint256 podsToRedeem
  ) private view returns (uint256) {
    if (podsToRedeem == 0) {
      return 0;
    }

    s.mustBeProtocolMember(pod);

    uint256 precision = s.getStablecoinPrecision();

    uint256 balance = s.getStablecoinOwnedByVaultInternal(coverKey);
    uint256 commitment = s.getTotalLiquidityUnderProtection(coverKey, precision);
    uint256 available = balance - commitment;

    uint256 releaseAmount = calculateLiquidityInternal(s, coverKey, pod, podsToRedeem);

    // You may need to wait till active policies expire
    require(available >= releaseAmount, "Insufficient balance. Lower the amount or wait till policy expiry."); // solhint-disable-line

    return releaseAmount;
  }

  function accrueInterestInternal(IStore s, bytes32 coverKey) external {
    (bool isWithdrawalPeriod, , , , ) = s.getWithdrawalInfoInternal(coverKey);
    require(isWithdrawalPeriod == true, "Withdrawal hasn't yet begun");

    s.updateStateAndLiquidity(coverKey);

    s.setAccrualCompleteInternal(coverKey, true);
  }

  function mustBeAccrued(IStore s, bytes32 coverKey) external view {
    require(s.isAccrualCompleteInternal(coverKey) == true, "Wait for accrual");
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
    bytes32 coverKey,
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
    require(IERC20(stablecoin).balanceOf(s.getVaultAddress(coverKey)) >= amount, "Amount insufficient");

    uint256 rate = _getFlashLoanFeeRateInternal(s);
    uint256 protocolRate = _getProtocolFlashLoanFeeRateInternal(s);

    fee = (amount * rate) / ProtoUtilV1.MULTIPLIER;
    protocolFee = (fee * protocolRate) / ProtoUtilV1.MULTIPLIER;
  }

  function getFlashFeeInternal(
    IStore s,
    bytes32 coverKey,
    address token,
    uint256 amount
  ) external view returns (uint256) {
    (uint256 fee, ) = getFlashFeesInternal(s, coverKey, token, amount);
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
  function getMaxFlashLoanInternal(
    IStore s,
    bytes32 coverKey,
    address token
  ) external view returns (uint256) {
    address stablecoin = s.getStablecoin();
    require(stablecoin != address(0), "Cover liquidity uninitialized");

    if (stablecoin == token) {
      return IERC20(stablecoin).balanceOf(s.getVaultAddress(coverKey));
    }

    /*
    https://eips.ethereum.org/EIPS/eip-3156

    The maxFlashLoan function MUST return the maximum loan possible for token.
    If a token is not currently supported maxFlashLoan MUST return 0, instead of reverting.    
    */
    return 0;
  }
}
