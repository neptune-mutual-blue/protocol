// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;

import "../core/cToken/cToken.sol";

// solhint-disable-next-line
library cTokenFactoryLibV1 {
  /**
   * @dev Gets the bytecode of the `cToken` contract
   * @param s Provide the store instance
   * @param key Provide the cover key
   * @param expiryDate Specify the expiry date of this cToken instance
   */
  function getByteCode(
    IStore s,
    bytes32 key,
    uint256 expiryDate
  ) external pure returns (bytes memory bytecode, bytes32 salt) {
    salt = keccak256(abi.encodePacked(ProtoUtilV1.NS_COVER_CTOKEN, key, expiryDate));
    bytecode = abi.encodePacked(type(cToken).creationCode, abi.encode(s, key, expiryDate));
  }
}
