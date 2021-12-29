// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

contract Destroyable {
  constructor() payable {} // solhint-disable-line

  // slither-disable-next-line suicidal
  function destroy(address payable _recipient) public {
    selfdestruct(_recipient);
  }
}
