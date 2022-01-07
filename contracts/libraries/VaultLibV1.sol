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
  function _calculatePods(
    address pod,
    address stablecoin,
    uint256 liquidityToAdd
  ) private view returns (uint256) {
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
   * @dev Calculates the amount of liquidity to transfer for the given amount of PODs to burn
   */
  function _calculateLiquidity(
    address pod,
    address stablecoin,
    uint256 podsToBurn
  ) private view returns (uint256) {
    uint256 balance = IERC20(stablecoin).balanceOf(address(this));
    return (balance * podsToBurn) / IERC20(pod).totalSupply();
  }

  // @todo: implement POD redemption feature
  // /**
  //  * @dev Internal function to redeem pods by burning. <br /> <br />
  //  * **How Does This Work?**
  //  * Transfer PODs --> This Contract --> Burn the PODs
  //  * This Contract --> Transfers Your Share of Liquidity Tokens
  //  * @param account Specify the address to burn the PODs from
  //  * @param podsToBurn Enter the amount of PODs to burn
  //  */
  // function redeemPodsInternal(
  //   address pod,
  //   address stablecoin,
  //   address account,
  //   uint256 podsToBurn
  // ) external returns (uint256) {
  //   uint256 amount = _calculateLiquidity(pod, stablecoin, podsToBurn);

  //   IERC20(pod).ensureTransferFrom(account, address(this), podsToBurn);
  //   IERC20(stablecoin).ensureTransfer(account, amount);

  //   return amount;
  // }

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
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, amount);

    uint256 minLiquidityPeriod = s.getMinLiquidityPeriod();
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, account, block.timestamp + minLiquidityPeriod); // solhint-disable-line

    uint256 podsToMint = _calculatePods(pod, stablecoin, amount);

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
    uint256 releaseAmount = _calculateLiquidity(pod, stablecoin, podsToRedeem);

    /*
     * You need to wait for the policy term to expire before you can withdraw
     * your liquidity.
     */
    require(available >= releaseAmount, "Insufficient balance"); // Insufficient balance. Please wait for the policy to expire.
    require(s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender) > 0, "Invalid request");
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender), "Withdrawal too early"); // solhint-disable-line

    // Update values
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, releaseAmount);

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
