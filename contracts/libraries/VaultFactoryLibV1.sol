// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

import "../core/liquidity/Vault.sol";

library VaultFactoryLibV1 {
  /**
   * @dev Gets the bytecode of the `Vault` contract
   * @param s Provide the store instance
   * @param key Provide the cover key
   * @param liquidityToken Specify the liquidity token for this Vault
   */
  function getByteCode(
    IStore s,
    bytes32 key,
    address liquidityToken
  ) external pure returns (bytes memory bytecode, bytes32 salt) {
    salt = keccak256(abi.encodePacked(ProtoUtilV1.NS_CONTRACTS, ProtoUtilV1.NS_COVER_VAULT, key));
    bytecode = abi.encodePacked(type(Vault).creationCode, abi.encode(s, key, liquidityToken));
  }
}
