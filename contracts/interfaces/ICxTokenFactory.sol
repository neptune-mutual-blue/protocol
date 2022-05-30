// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./IStore.sol";
import "./IMember.sol";

interface ICxTokenFactory is IMember {
  event CxTokenDeployed(bytes32 indexed coverKey, address cxToken, uint256 expiryDate);

  function deploy(bytes32 coverKey, uint256 expiryDate) external returns (address);
}
