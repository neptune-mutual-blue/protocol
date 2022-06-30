// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../core/Recoverable.sol";

contract FakeRecoverable is Recoverable {
  constructor(IStore s) Recoverable(s) {} // solhint-disable-line
}
