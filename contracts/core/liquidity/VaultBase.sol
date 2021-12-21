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
import "../../libraries/NTransferUtilV2.sol";

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
  using ValidationLibV1 for IStore;
  using CoverUtilV1 for IStore;
  using NTransferUtilV2 for IERC20;

  bytes32 public key;
  address public lqt;

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
  ) ERC20("Proof of Deposits", "PODs") Recoverable(store) {
    key = coverKey;
    lqt = address(liquidityToken);
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
    s.mustNotBePaused();
    s.mustBeValidCover(key);
    s.callerMustBeCoverContract();

    _addLiquidity(coverKey, account, amount, true);
  }

  function transferGovernance(
    bytes32 coverKey,
    address to,
    uint256 amount
  ) external override nonReentrant {
    s.mustNotBePaused();
    s.callerMustBeClaimsProcessorContract();
    require(coverKey == key, "Forbidden");

    IERC20(lqt).ensureTransfer(to, amount);
    emit GovernanceTransfer(to, amount);
  }

  /**
   * @dev Adds liquidity to the specified cover contract
   * @param coverKey Enter the cover key
   * @param amount Enter the amount of liquidity token to supply.
   */
  function addLiquidity(bytes32 coverKey, uint256 amount) external override nonReentrant {
    s.mustNotBePaused();
    s.mustBeValidCover(key);

    _addLiquidity(coverKey, msg.sender, amount, false);
  }

  /**
   * @dev Removes liquidity from the specified cover contract
   * @param coverKey Enter the cover key
   * @param podsToRedeem Enter the amount of pods to redeem
   */
  function removeLiquidity(bytes32 coverKey, uint256 podsToRedeem) external override nonReentrant {
    s.mustNotBePaused();
    require(coverKey == key, "Forbidden");
    uint256 released = VaultLibV1.removeLiquidity(s, coverKey, address(this), lqt, podsToRedeem);

    emit PodsRedeemed(msg.sender, podsToRedeem, released);
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

    uint256 podsToMint = VaultLibV1.addLiquidity(s, coverKey, address(this), lqt, account, amount, initialLiquidity);
    super._mint(account, podsToMint);

    emit PodsIssued(account, podsToMint, amount);
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
