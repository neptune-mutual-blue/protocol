// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IVault.sol";
import "../../interfaces/IVaultFactory.sol";
import "./Vault.sol";

// Todo: Recovery Feature
/**
 * @title Vault Factory Contract
 * @dev As and when required by the protocol,
 * the VaultFactory contract creates new instances of
 * Cover Vaults on demand.
 */

contract VaultFactory is IVaultFactory {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using StoreKeyUtil for IStore;

  /**
   * @dev Deploys a new instance of Vault
   * @param s Provide the store contract instance
   * @param key Enter the cover key related to this Vault instance
   */
  function deploy(IStore s, bytes32 key) external override returns (address addr) {
    s.mustBeExactContract(ProtoUtilV1.CNAME_COVER, msg.sender); // Ensure the caller is the latest cover contract

    (bytes memory bytecode, bytes32 salt) = _getByteCode(s, key, s.getLiquidityToken());

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
        revert(0, 0)
      }
    }
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
    return ProtoUtilV1.CNAME_VAULT_FACTORY;
  }

  function _getByteCode(
    IStore s,
    bytes32 key,
    address liquidityToken
  ) private pure returns (bytes memory bytecode, bytes32 salt) {
    salt = abi.encodePacked(ProtoUtilV1.NS_COVER_VAULT, key).toKeccak256();
    bytecode = abi.encodePacked(type(Vault).creationCode, abi.encode(s, key, liquidityToken));
  }
}
