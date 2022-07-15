// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/governance/TimelockController.sol";
import "./WithRecovery.sol";

contract Delayable is TimelockController, WithRecovery {
  constructor(
    uint256 minDelay,
    address[] memory proposers,
    address[] memory executors
  ) TimelockController(minDelay, proposers, executors) {} // solhint-disable-line
}
