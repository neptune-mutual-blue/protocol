// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "./IStore.sol";

interface IRecoverable {
  function s() external view returns (IStore);

  function recoverEther(address sendTo) external;

  function recoverToken(address token, address sendTo) external;
}
