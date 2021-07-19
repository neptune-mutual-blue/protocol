// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

import "./VaultPod.sol";

/**
 * @title Cover Vault for Liquidity
 * @dev Liquidity providers can earn fees by adding stablecoin liquidity
 * to any cover contract. The cover pool is collectively owned by liquidity providers
 * where fees automatically get accumulated and compounded. <br /> <br />
 * **Fees** <br />
 *
 * - Cover fees paid in stablecoin get added to the liquidity pool.
 * - The protocol supplies a small portion of idle assets to lending protocols (v2).
 * - Flash loan interest also gets added back to the pool.
 * - To protect liquidity providers from cover incidents, they can redeem upto 25% of the cover payouts through NEP provision.
 * - To protect liquidity providers from cover incidents, they can redeem upto 25% of the cover payouts through `assurance token` allocation.
 */
contract Vault is VaultPod {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using RegistryLibV1 for IStore;
  using ValidationLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;

  constructor(
    IStore store,
    bytes32 coverKey,
    IERC20 liquidityToken
  ) VaultPod(store, coverKey, liquidityToken) {
    this;
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param account Specify the account on behalf of which the liquidity is being added.
   * @param amount Enter the amount of liquidity token to supply.
   */
  function addLiquidityInternal(
    bytes32 coverKey,
    address account,
    uint256 amount
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCover(key);
    s.callerMustBeCoverContract();

    _addLiquidity(coverKey, account, amount, true);
  }

  function transferGovernance(
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external override nonReentrant {
    _mustBeUnpaused();
    s.callerMustBeClaimsProcessorContract();

    IERC20(lqt).ensureTransfer(to, amount);
    emit GovernanceTransfer(coverKey, to, amount);
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of liquidity token to supply.
   */
  function addLiquidity(bytes32 coverKey, uint256 amount) external override nonReentrant {
    _mustBeUnpaused();
    s.mustBeValidCover(key);

    _addLiquidity(coverKey, super._msgSender(), amount, false);
  }

  /**
   * @dev Removes liquidity from the specified cover contract
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of liquidity token to remove.
   */
  function removeLiquidity(bytes32 coverKey, uint256 amount) external override nonReentrant {
    _mustBeUnpaused();

    s.mustBeValidCover(key);
    require(coverKey == key, "Forbidden");

    uint256 available = s.getPolicyContract().getCoverable(key);

    /*
     * You need to wait for the policy term to expire before you can withdraw
     * your liquidity.
     */
    require(available >= amount, "Insufficient balance"); // Insufficient balance. Please wait for the policy to expire.
    require(s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, key, super._msgSender()) > 0, "Invalid request");
    require(block.timestamp > s.getUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, key, super._msgSender()), "Withdrawal too early"); // solhint-disable-line

    // Update values
    s.subtractUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key, amount);

    /***
     * Send liquidity tokens back
     */

    super._redeemPods(super._msgSender(), amount);
    emit LiquidityRemoved(key, amount);
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param account Specify the account on behalf of which the liquidity is being added.
   * @param amount Enter the amount of liquidity token to supply.
   */
  function _addLiquidity(
    bytes32 coverKey,
    address account,
    uint256 amount,
    bool initialLiquidity
  ) private {
    require(coverKey == key, "Forbidden");
    require(account != address(0), "Invalid account");

    address liquidityToken = s.getLiquidityToken();
    require(lqt == liquidityToken, "Vault migration required");

    // Update values
    s.addUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY, key, amount);

    uint256 minLiquidityPeriod = s.getMinLiquidityPeriod();
    s.setUintByKeys(ProtoUtilV1.NS_COVER_LIQUIDITY_RELEASE_DATE, key, account, block.timestamp + minLiquidityPeriod); // solhint-disable-line

    super._mintPods(account, amount, initialLiquidity);

    emit LiquidityAdded(key, amount);
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
  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_LIQUIDITY_VAULT;
  }
}
