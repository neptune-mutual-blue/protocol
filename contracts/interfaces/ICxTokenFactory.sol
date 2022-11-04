// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IStore.sol";
import "./IMember.sol";

interface ICxTokenFactory is IMember {
  event CxTokenDeployed(address cxToken, IStore store, bytes32 indexed coverKey, bytes32 indexed productKey, string tokenName, uint256 indexed expiryDate);

  function deploy(
    bytes32 coverKey,
    bytes32 productKey,
    string calldata tokenName,
    uint256 expiryDate
  ) external returns (address);
}
