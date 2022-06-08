// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IStore.sol";
import "./IMember.sol";

interface IVaultFactory is IMember {
  event VaultDeployed(bytes32 indexed coverKey, address vault);

  function deploy(
    bytes32 coverKey,
    string memory name,
    string memory symbol
  ) external returns (address);
}
