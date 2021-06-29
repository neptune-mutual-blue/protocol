// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./IStore.sol";
import "./IMember.sol";

interface ICTokenFactory is IMember {
  function deploy(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) external returns (address);
}
