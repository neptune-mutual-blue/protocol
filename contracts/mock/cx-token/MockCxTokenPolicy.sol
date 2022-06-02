// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../interfaces/ICxToken.sol";

contract MockCxTokenPolicy {
  ICxToken public cxToken;

  constructor(ICxToken _cxToken) {
    cxToken = _cxToken;
  }

  function callMint(
    bytes32 key,
    bytes32 productKey,
    address to,
    uint256 amount
  ) external {
    cxToken.mint(key, productKey, to, amount);
  }
}
