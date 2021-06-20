// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

interface IMember {
  function version() external pure returns (bytes32);

  function getName() external pure returns (bytes32);
}
