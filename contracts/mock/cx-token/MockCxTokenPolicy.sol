// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../interfaces/ICxToken.sol";

contract MockCxTokenPolicy {
  ICxToken public _cxToken;

  constructor(ICxToken cxToken) {
    _cxToken = cxToken;
  }

  function callMint(
    bytes32 key,
    address to,
    uint256 amount
  ) public {
    _cxToken.mint(key, to, amount);
  }
}
