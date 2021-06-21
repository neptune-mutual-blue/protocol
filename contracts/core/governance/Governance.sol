// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "./Witness.sol";

// solhint-disable-next-line
contract Governance is Witness {
  constructor(IStore store) Witness(store) {
    this;
  }
}
