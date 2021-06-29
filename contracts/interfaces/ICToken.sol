// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

interface ICToken {
  function mint(
    bytes32 key,
    address to,
    uint256 amount
  ) external;

  function finalize() external;

  function expiresOn() external view returns (uint256);

  function coverKey() external view returns (bytes32);
}
