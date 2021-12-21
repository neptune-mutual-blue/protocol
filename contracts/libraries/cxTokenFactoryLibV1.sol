// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "../core/cxToken/cxToken.sol";

// solhint-disable-next-line
library cxTokenFactoryLibV1 {
  /**
   * @dev Gets the bytecode of the `cxToken` contract
   * @param s Provide the store instance
   * @param key Provide the cover key
   * @param expiryDate Specify the expiry date of this cxToken instance
   */
  function getByteCode(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) external pure returns (bytes memory bytecode, bytes32 salt) {
    salt = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CXTOKEN, key, expiryDate));
    bytecode = abi.encodePacked(type(cxToken).creationCode, abi.encode(s, key, expiryDate));
  }
}
