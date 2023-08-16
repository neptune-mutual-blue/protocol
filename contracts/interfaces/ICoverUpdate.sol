// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IMember.sol";

interface ICoverUpdate is IMember{
  event CoverDeleted(bytes32 indexed coverKey);
  event ProductDeleted(bytes32 indexed coverKey, bytes32 indexed productKey);

  function deleteCover(bytes32 coverKey) external;
  function deleteProduct(bytes32 coverKey, bytes32 productKey) external;
}
