// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../interfaces/IVault.sol";
import "../../interfaces/IVaultFactory.sol";
import "../../libraries/VaultFactoryLibV1.sol";
import "../../libraries/ValidationLibV1.sol";
import "../Recoverable.sol";

/**
 * @title Vault Factory Contract
 * @dev As and when required by the protocol,
 * the VaultFactory contract creates new instances of
 * Cover Vaults on demand.
 */

contract VaultFactory is IVaultFactory, Recoverable {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;
  using ValidationLibV1 for IStore;

  /**
   * @dev Constructs this contract
   * @param store Provide the store contract instance
   */
  constructor(IStore store) Recoverable(store) {} // solhint-disable-line

  /**
   * @dev Deploys a new instance of Vault
   * @param s Provide the store contract instance
   * @param key Enter the cover key related to this Vault instance
   */
  function deploy(IStore s, bytes32 key) external override nonReentrant returns (address addr) {
    s.mustNotBePaused();
    s.mustBeValidCover(key);
    s.callerMustBeCoverContract();

    (bytes memory bytecode, bytes32 salt) = VaultFactoryLibV1.getByteCode(s, key, s.getStablecoin());

    // solhint-disable-next-line
    assembly {
      addr := create2(
        callvalue(), // wei sent with current call
        // Actual code starts after skipping the first 32 bytes
        add(bytecode, 0x20),
        mload(bytecode), // Load the size of code contained in the first 32 bytes
        salt // Salt from function arguments
      )

      if iszero(extcodesize(addr)) {
        // @suppress-revert This is correct usage
        revert(0, 0)
      }
    }

    emit VaultDeployed(key, addr);
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
  function getName() external pure override returns (bytes32) {
    return ProtoUtilV1.CNAME_VAULT_FACTORY;
  }
}
