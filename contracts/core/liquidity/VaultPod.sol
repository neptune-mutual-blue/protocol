// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../Recoverable.sol";
import "../../interfaces/IVault.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/StoreKeyUtil.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/RegistryLibV1.sol";
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
abstract contract VaultPod is IVault, Recoverable, ERC20 {
  using NTransferUtilV2 for IERC20;
  using StoreKeyUtil for IStore;
  using RegistryLibV1 for IStore;

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
   * @dev Internal function to mint pods by transferring liquidity. <br /> <br />
   * **How Does This Work?**
   * You --> Liquidity Tokens --> This Contract
   * This Contract --> PODS --> You
   * @param account Specify the address to send the minted PODs to
   * @param liquidityToAdd Enter the amount of liquidity to add
   * @param initialLiquidity Indicate if this the first liquidity being added to the POD.
   * Note: The cover contract transfers the liquidity only after the `Vault` contract is deployed.
   * This argument should be used with caution.
   */
  function _mintPods(
    address account,
    uint256 liquidityToAdd,
    bool initialLiquidity
  ) internal {
    uint256 pods = _calculatePods(liquidityToAdd);

    if (initialLiquidity == false) {
      // First deposit the tokens
      IERC20(lqt).ensureTransferFrom(account, address(this), liquidityToAdd);
    }

    super._mint(account, pods);

    emit PodsMinted(account, pods, address(this), liquidityToAdd);
  }

  /**
   * @dev Internal function to redeem pods by burning. <br /> <br />
   * **How Does This Work?**
   * You --> PODs --> This Contract --> Burn
   * This Contract --> Your Share of Liquidity Tokens --> You
   * @param account Specify the address to burn the PODs from
   * @param podsToBurn Enter the amount of PODs to burn
   */
  function _redeemPods(address account, uint256 podsToBurn) internal {
    uint256 amount = _calculateLiquidity(podsToBurn);

    super.transferFrom(account, address(this), podsToBurn);
    super._burn(address(this), podsToBurn);

    IERC20(lqt).ensureTransfer(account, amount);
  }

  /**
   * @dev Calculates the amount of liquidity to transfer for the given amount of PODs to burn
   */
  function _calculateLiquidity(uint256 podsToBurn) private view returns (uint256) {
    uint256 balance = IERC20(lqt).balanceOf(address(this));
    return (balance * podsToBurn) / super.totalSupply();
  }

  /**
   * @dev Calculates the amount of PODS to mint for the given amount of liquidity to transfer
   */
  function _calculatePods(uint256 liquidityToAdd) private view returns (uint256) {
    uint256 balance = IERC20(lqt).balanceOf(address(this));

    if (balance == 0) {
      return liquidityToAdd;
    }

    return (super.totalSupply() * liquidityToAdd) / balance;
  }
}
