// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../Recoverable.sol";
import "../../interfaces/IVaultDelegate.sol";
import "../../interfaces/IVault.sol";
import "../../libraries/NTransferUtilV2.sol";

pragma solidity ^0.8.0;

/**
 * @title Vault Base Contract
 */
abstract contract VaultBase is ERC20, Recoverable, IVault {
  using ProtoUtilV1 for IStore;
  using RegistryLibV1 for IStore;
  using NTransferUtilV2 for IERC20;

  bytes32 public override key;
  address public override sc;

  /**
   * @dev Constructs this contract
   *
   * @param store Provide store instance
   * @param coverKey Provide a cover key that doesn't have a vault deployed
   * @param tokenName Enter the token name of the POD. Example: `Uniswap nDAI` or `Uniswap nUSDC`
   * @param tokenSymbol Enter the token symbol of the POD. Example: UNI-NDAI or `UNI-NUSDC`.
   * @param stablecoin Provide an instance of the stablecoin this vault supports.
   *
   */
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

  /**
   * @dev Returns the delegate contract instance
   */
  function delegate() public view returns (IVaultDelegate) {
    return IVaultDelegate(s.getVaultDelegate());
  }
}
