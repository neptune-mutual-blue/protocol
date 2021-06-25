// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../Recoverable.sol";
import "../../interfaces/IVault.sol";
import "../../interfaces/IVault.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";

abstract contract VaultPod is IVault, Recoverable, ERC20 {
  using NTransferUtilV2 for IERC20;
  IStore public s;
  bytes32 public key;
  address public lqt;

  constructor(
    IStore store,
    bytes32 coverKey,
    IERC20 liquidityToken
  ) ERC20("Proof of Deposits", "PODs") {
    s = store;
    key = coverKey;
    lqt = address(liquidityToken);
  }

  function _mintPods(address account, uint256 liquidityToAdd) internal {
    // First deposit the tokens
    IERC20(lqt).ensureTransferFrom(account, address(this), liquidityToAdd);

    uint256 pods = _calculatePods(liquidityToAdd);
    super._mint(account, pods);
  }

  function _burnPods(address account, uint256 podsToBurn) internal {
    uint256 amount = _calculateLiquidity(podsToBurn);

    super.transferFrom(account, address(this), podsToBurn);
    super._burn(address(this), podsToBurn);

    IERC20(lqt).ensureTransferFrom(address(this), account, amount);
  }

  function _calculateLiquidity(uint256 podsToBurn) private view returns (uint256) {
    uint256 balance = IERC20(lqt).balanceOf(address(this));
    return (balance * podsToBurn) / super.totalSupply();
  }

  function _calculatePods(uint256 liquidityToAdd) private view returns (uint256) {
    uint256 balance = IERC20(lqt).balanceOf(address(this));

    if (balance == 0) {
      return liquidityToAdd;
    }

    return (super.totalSupply() * liquidityToAdd) / balance;
  }
}
