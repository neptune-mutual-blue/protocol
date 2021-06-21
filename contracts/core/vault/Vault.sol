// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IStore.sol";
import "../../interfaces/IVault.sol";
import "../../libraries/ProtoUtilV1.sol";
import "../../libraries/CoverUtilV1.sol";
import "../../libraries/NTransferUtilV2.sol";
import "../Recoverable.sol";

contract Vault is IVault, Recoverable {
  using NTransferUtilV2 for IERC20;

  function transferOut(
    IERC20 token,
    address recipient,
    uint256 amount
  ) external override onlyOwner whenNotPaused {
    IERC20(token).ensureTransfer(recipient, amount);
  }

  function version() external pure override returns (bytes32) {
    return "v0.1";
  }

  function getName() public pure override returns (bytes32) {
    return ProtoUtilV1.CONTRACTS_VAULT;
  }
}
