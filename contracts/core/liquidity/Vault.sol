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
  using NTransferUtilV2 for IERC20;
  using CoverUtilV1 for IStore;

  event LiquidityAdded(bytes32 key, uint256 amount);
  event LiquidityRemoved(bytes32 key, uint256 amount);

  /**
   * @dev Ensures the caller to be the cover contract
   */
  modifier onlyFromCover() {
    s.ensureMemberWithName(ProtoUtilV1.CONTRACTS_COVER);
    _;
  }

  /**
   * Ensures the cover key is a valid cover contract
   */
  modifier onlyValidCover() {
    s.ensureValidCover(key); // Ensures the key is valid cover
    _;
  }

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
  ) external override onlyValidCover onlyFromCover nonReentrant whenNotPaused {
    _addLiquidity(coverKey, account, amount);
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of liquidity token to supply.
   */
  function addLiquidity(bytes32 coverKey, uint256 amount) external override onlyValidCover nonReentrant whenNotPaused {
    _addLiquidity(coverKey, super._msgSender(), amount);
  }

  /**
   * @dev Removes liquidity from the specified cover contract
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of liquidity token to remove.
   */
  function removeLiquidity(bytes32 coverKey, uint256 amount) external override onlyValidCover nonReentrant whenNotPaused {
    require(coverKey == key, "Forbidden");

    uint256 available = s.getPolicyContract().getCoverable(key);

    /*
     * You need to wait for the policy term to expire before you can withdraw
     * your liquidity.
     */
    require(available >= amount, "Insufficient balance"); // Insufficient balance. Please wait for the policy to expire.

    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_RELEASE_DATE, key, super._msgSender()).toKeccak256();
    require(s.getUint(k) > 0, "Invalid request");

    require(block.timestamp > s.getUint(k), "Withdrawal too early"); // solhint-disable-line

    // Update values
    k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY, key).toKeccak256();
    s.subtractUint(k, amount);

    /***
     * Send liquidity tokens back
     */

    super._burnPods(super._msgSender(), amount);
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
    uint256 amount
  ) private {
    require(coverKey == key, "Forbidden");
    require(account != address(0), "Invalid account");

    address liquidityToken = s.getLiquidityToken();
    require(lqt == address(liquidityToken), "Vault migration required");

    // Update values
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY, key).toKeccak256();
    s.addUint(k, amount);

    uint256 minLiquidityPeriod = s.getProtocol().getMinLiquidityPeriod();
    k = abi.encodePacked(ProtoUtilV1.KP_COVER_LIQUIDITY_RELEASE_DATE, key, account).toKeccak256();
    s.setUint(k, block.timestamp + minLiquidityPeriod); // solhint-disable-line

    super._mintPods(account, amount);

    emit LiquidityAdded(key, amount);
  }

  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CONTRACTS_LIQUIDITY_VAULT;
  }
}
