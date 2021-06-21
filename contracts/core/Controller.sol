// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;
import "../interfaces/IStore.sol";
import "../libraries/ProtoUtilV1.sol";
import "./Recoverable.sol";

contract Controller is Recoverable {
  IStore public s;

  constructor(IStore store) {
    s = store;
  }
}
