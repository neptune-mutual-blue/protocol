// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../Recoverable.sol";
import "../../interfaces/IVaultDelegate.sol";
import "../../interfaces/IVault.sol";
import "../../libraries/NTransferUtilV2.sol";

pragma solidity 0.8.0;

abstract contract VaultBase is ERC20, Recoverable, IVault {
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  bytes32 public override key;
  address public override sc;

  constructor(
    IStore store,
    bytes32 coverKey,
    string memory tokenName,
    string memory tokenSymbol,
    IERC20 stablecoin
  ) ERC20(tokenName, tokenSymbol) Recoverable(store) {
    key = coverKey;
    sc = address(stablecoin);
  }

  function delgate() public view returns (IVaultDelegate) {
    address delegate = s.getVaultDelegate();
    return IVaultDelegate(delegate);
  }
}
