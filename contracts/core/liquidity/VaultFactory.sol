// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../../interfaces/IVault.sol";
import "../../interfaces/IVaultFactory.sol";
import "../liquidity/Vault.sol";

/**
 * @title Cover Contract
 */
contract VaultFactory is IVaultFactory {
  using ProtoUtilV1 for bytes;
  using ProtoUtilV1 for IStore;
  using CoverUtilV1 for IStore;

  function deploy(IStore s, bytes32 key) external override returns (address addr) {
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

  function setVault(
    IStore s,
    bytes32 key,
    address liquidity
  ) external {
    bytes32 k = abi.encodePacked(ProtoUtilV1.KP_COVER_VAULT, key).toKeccak256();
    require(s.getAddress(k) != address(0), "You should deploy instead");

    s.setAddress(k, liquidity);
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
    return ProtoUtilV1.CONTRACTS_VAULT_FACTORY;
  }

  function _getByteCode(
    IStore s,
    bytes32 key,
    address liquidityToken
  ) private pure returns (bytes memory bytecode, bytes32 salt) {
    salt = abi.encodePacked(ProtoUtilV1.KP_COVER_VAULT, key).toKeccak256();
    bytecode = abi.encodePacked(type(Vault).creationCode, abi.encode(s, key, liquidityToken));
  }
}
