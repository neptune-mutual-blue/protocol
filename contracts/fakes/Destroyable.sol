// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

contract Destroyable {
  constructor() payable {} // solhint-disable-line

  function destroy(address payable _recipient) public {
    selfdestruct(_recipient);
  }
}
