// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../libraries/StoreKeyUtil.sol";

contract MockStoreKeyUtilUser {
  using StoreKeyUtil for IStore;
  IStore public s;

  constructor(IStore store) {
    s = store;
  }

  function setStringByKey(bytes32 key, string memory value) external {
    s.setStringByKey(key, value);
  }

  function getStringByKey(bytes32 key) external view returns (string memory) {
    return s.getStringByKey(key);
  }

  function setAddressByKey(bytes32 key, address value) external {
    s.setAddressByKey(key, value);
  }

  function getAddressByKey(bytes32 key) external view returns (address) {
    return s.getAddressByKey(key);
  }

  function deleteAddressByKey(bytes32 key) external {
    s.deleteAddressByKey(key);
  }

  // Used for testing count method
  function setAddressArrayByKey(bytes32 key1, address value) external {
    s.setAddressArrayByKey(key1, value);
  }

  // Single key
  function deleteAddressArrayByKey(bytes32 key1, address value) external {
    s.deleteAddressArrayByKey(key1, value);
  }

  // Single key
  function countAddressArrayByKey(bytes32 key1) external view returns (uint256) {
    return s.countAddressArrayByKey(key1);
  }

  // Used for testing count method
  function setAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    address value
  ) external {
    s.setAddressArrayByKeys(key1, key2, value);
  }

  function getAddressArrayByKeys(bytes32 key1, bytes32 key2) external view returns (address[] memory) {
    return s.getAddressArrayByKeys(key1, key2);
  }

  // 2 keys
  function deleteAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    address value
  ) external {
    s.deleteAddressArrayByKeys(key1, key2, value);
  }

  // 2 keys
  function countAddressArrayByKeys(bytes32 key1, bytes32 key2) external view returns (uint256) {
    return s.countAddressArrayByKeys(key1, key2);
  }

  function setAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address value
  ) external {
    s.setAddressArrayByKeys(key1, key2, key3, value);
  }

  function getAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (address[] memory) {
    return s.getAddressArrayByKeys(key1, key2, key3);
  }

  // 3 keys
  function deleteAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address value
  ) external {
    s.deleteAddressArrayByKeys(key1, key2, key3, value);
  }

  // 3 keys
  function countAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (uint256) {
    return s.countAddressArrayByKeys(key1, key2, key3);
  }

  function setAddressBooleanByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address account,
    bool value
  ) external {
    s.setAddressBooleanByKeys(key1, key2, key3, account, value);
  }

  function getAddressBooleanByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address account
  ) external view returns (bool) {
    return s.getAddressBooleanByKeys(key1, key2, key3, account);
  }

  function setBytes32ByKey(bytes32 key, bytes32 value) external {
    s.setBytes32ByKey(key, value);
  }

  function getBytes32ByKey(bytes32 key) external view returns (bytes32) {
    return s.getBytes32ByKey(key);
  }
}
