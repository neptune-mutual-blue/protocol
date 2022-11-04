// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IStore.sol";
import "./IMember.sol";

interface IVaultFactory is IMember {
  event VaultDeployed(address vault, bytes32 indexed coverKey, string name, string symbol);

  function deploy(
    bytes32 coverKey,
    string calldata name,
    string calldata symbol
  ) external returns (address);
}
