// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
/* solhint-disable ordering  */
pragma solidity >=0.4.22 <0.9.0;
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
  function calculatePods(
    address pod,
    address stablecoin,
    uint256 liquidityToAdd
  ) public view returns (uint256) {
    uint256 balance = IERC20(stablecoin).balanceOf(address(this));

    if (balance == 0) {
      return liquidityToAdd;
    }

    return (IERC20(pod).totalSupply() * liquidityToAdd) / balance;
  }

  /**
   * @dev Calculates the amount of liquidity to transfer for the given amount of PODs to burn
   */
  function calculateLiquidity(
    address pod,
    address stablecoin,
    uint256 podsToBurn
  ) public view returns (uint256) {
    uint256 balance = IERC20(stablecoin).balanceOf(address(this));
    return (balance * podsToBurn) / IERC20(pod).totalSupply();
  }

  /**
   * @dev Internal function to redeem pods by burning. <br /> <br />
   * **How Does This Work?**
   * Transfer PODs --> This Contract --> Burn the PODs
   * This Contract --> Transfers Your Share of Liquidity Tokens
   * @param account Specify the address to burn the PODs from
   * @param podsToBurn Enter the amount of PODs to burn
   */
  function redeemPods(
    address pod,
    address stablecoin,
    address account,
    uint256 podsToBurn
  ) public returns (uint256) {
    uint256 amount = calculateLiquidity(pod, stablecoin, podsToBurn);

    IERC20(pod).transferFrom(account, address(this), podsToBurn);
    IERC20(stablecoin).ensureTransfer(account, amount);

    return amount;
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param account Specify the account on behalf of which the liquidity is being added.
   * @param amount Enter the amount of liquidity token to supply.
   */
  function addLiquidity(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    address account,
    uint256 amount,
    bool initialLiquidity
  ) public returns (uint256) {
    require(account != address(0), "Invalid account");

    address liquidityToken = s.getLiquidityToken();
    require(stablecoin == liquidityToken, "Vault migration required");

    // Update values
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, amount);

    uint256 minLiquidityPeriod = s.getMinLiquidityPeriod();
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, account, block.timestamp + minLiquidityPeriod); // solhint-disable-line

    uint256 podsToMint = calculatePods(pod, stablecoin, amount);

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
  function removeLiquidity(
    IStore s,
    bytes32 coverKey,
    address pod,
    address stablecoin,
    uint256 podsToRedeem
  ) public returns (uint256) {
    s.mustBeValidCover(coverKey);

    uint256 available = s.getPolicyContract().getCoverable(coverKey);
    uint256 releaseAmount = calculateLiquidity(pod, stablecoin, podsToRedeem);

    /*
     * You need to wait for the policy term to expire before you can withdraw
     * your liquidity.
     */
    require(available >= releaseAmount, "Insufficient balance"); // Insufficient balance. Please wait for the policy to expire.
    require(s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender) > 0, "Invalid request");
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, coverKey, msg.sender), "Withdrawal too early"); // solhint-disable-line

    // Update values
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, coverKey, releaseAmount);

    IERC20(pod).transferFrom(msg.sender, address(this), podsToRedeem);
    IERC20(stablecoin).ensureTransfer(msg.sender, releaseAmount);

    return releaseAmount;
  }
}
