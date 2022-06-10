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

  function setUintByKey(bytes32 key, uint256 value) external {
    s.setUintByKey(key, value);
  }

  function setUintByKeys(
    bytes32 key1,
    bytes32 key2,
    uint256 value
  ) external {
    s.setUintByKeys(key1, key2, value);
  }

  function setUintByKeys(
    bytes32 key1,
    bytes32 key2,
    address account,
    uint256 value
  ) external {
    s.setUintByKeys(key1, key2, account, value);
  }

  function addUintByKey(bytes32 key, uint256 value) external {
    s.addUintByKey(key, value);
  }

  function addUintByKeys(
    bytes32 key1,
    bytes32 key2,
    uint256 value
  ) external {
    s.addUintByKeys(key1, key2, value);
  }

  function addUintByKeys(
    bytes32 key1,
    bytes32 key2,
    address account,
    uint256 value
  ) external {
    s.addUintByKeys(key1, key2, account, value);
  }

  function subtractUintByKey(bytes32 key, uint256 value) external {
    s.subtractUintByKey(key, value);
  }

  function subtractUintByKeys(
    bytes32 key1,
    bytes32 key2,
    uint256 value
  ) external {
    s.subtractUintByKeys(key1, key2, value);
  }

  function subtractUintByKeys(
    bytes32 key1,
    bytes32 key2,
    address account,
    uint256 value
  ) external {
    s.subtractUintByKeys(key1, key2, account, value);
  }

  function setStringByKey(bytes32 key, string calldata value) external {
    s.setStringByKey(key, value);
  }

  function setStringByKeys(
    bytes32 key1,
    bytes32 key2,
    string calldata value
  ) external {
    s.setStringByKeys(key1, key2, value);
  }

  function setBytes32ByKey(bytes32 key, bytes32 value) external {
    s.setBytes32ByKey(key, value);
  }

  function setBytes32ByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 value
  ) external {
    s.setBytes32ByKeys(key1, key2, value);
  }

  function setBoolByKey(bytes32 key, bool value) external {
    s.setBoolByKey(key, value);
  }

  function setBoolByKeys(
    bytes32 key1,
    bytes32 key2,
    bool value
  ) external {
    s.setBoolByKeys(key1, key2, value);
  }

  function setBoolByKeys(
    bytes32 key,
    address account,
    bool value
  ) external {
    s.setBoolByKeys(key, account, value);
  }

  function setAddressByKey(bytes32 key, address value) external {
    s.setAddressByKey(key, value);
  }

  function setAddressByKeys(
    bytes32 key1,
    bytes32 key2,
    address value
  ) external {
    s.setAddressByKeys(key1, key2, value);
  }

  function setAddressByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address value
  ) external {
    s.setAddressByKeys(key1, key2, key3, value);
  }

  function setAddressArrayByKey(bytes32 key, address value) external {
    s.setAddressArrayByKey(key, value);
  }

  function setAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    address value
  ) external {
    s.setAddressArrayByKeys(key1, key2, value);
  }

  function setAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address value
  ) external {
    s.setAddressArrayByKeys(key1, key2, key3, value);
  }

  function setAddressBooleanByKey(
    bytes32 key,
    address account,
    bool value
  ) external {
    s.setAddressBooleanByKey(key, account, value);
  }

  function setAddressBooleanByKeys(
    bytes32 key1,
    bytes32 key2,
    address account,
    bool value
  ) external {
    s.setAddressBooleanByKeys(key1, key2, account, value);
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

  function deleteUintByKey(bytes32 key) external {
    s.deleteUintByKey(key);
  }

  function deleteUintByKeys(bytes32 key1, bytes32 key2) external {
    s.deleteUintByKeys(key1, key2);
  }

  function deleteBytes32ByKey(bytes32 key) external {
    s.deleteBytes32ByKey(key);
  }

  function deleteBytes32ByKeys(bytes32 key1, bytes32 key2) external {
    s.deleteBytes32ByKeys(key1, key2);
  }

  function deleteBytes32ArrayByKey(bytes32 key, bytes32 value) external {
    s.deleteBytes32ArrayByKey(key, value);
  }

  function deleteBytes32ArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 value
  ) external {
    s.deleteBytes32ArrayByKeys(key1, key2, value);
  }

  function deleteBytes32ArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    bytes32 value
  ) external {
    s.deleteBytes32ArrayByKeys(key1, key2, key3, value);
  }

  function deleteBytes32ArrayByIndexByKey(bytes32 key, uint256 index) external {
    s.deleteBytes32ArrayByIndexByKey(key, index);
  }

  function deleteBytes32ArrayByIndexByKeys(
    bytes32 key1,
    bytes32 key2,
    uint256 index
  ) external {
    s.deleteBytes32ArrayByIndexByKeys(key1, key2, index);
  }

  function deleteBytes32ArrayByIndexByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    uint256 index
  ) external {
    s.deleteBytes32ArrayByIndexByKeys(key1, key2, key3, index);
  }

  function deleteBoolByKey(bytes32 key) external {
    s.deleteBoolByKey(key);
  }

  function deleteBoolByKeys(bytes32 key1, bytes32 key2) external {
    s.deleteBoolByKeys(key1, key2);
  }

  function deleteBoolByKeys(bytes32 key, address account) external {
    s.deleteBoolByKeys(key, account);
  }

  function deleteAddressByKey(bytes32 key) external {
    s.deleteAddressByKey(key);
  }

  function deleteAddressByKeys(bytes32 key1, bytes32 key2) external {
    s.deleteAddressByKeys(key1, key2);
  }

  function deleteAddressByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external {
    s.deleteAddressByKeys(key1, key2, key3);
  }

  function deleteAddressArrayByKey(bytes32 key, address value) external {
    s.deleteAddressArrayByKey(key, value);
  }

  function deleteAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    address value
  ) external {
    s.deleteAddressArrayByKeys(key1, key2, value);
  }

  function deleteAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address value
  ) external {
    s.deleteAddressArrayByKeys(key1, key2, key3, value);
  }

  function deleteAddressArrayByIndexByKey(bytes32 key, uint256 index) external {
    s.deleteAddressArrayByIndexByKey(key, index);
  }

  function deleteAddressArrayByIndexByKeys(
    bytes32 key1,
    bytes32 key2,
    uint256 index
  ) external {
    s.deleteAddressArrayByIndexByKeys(key1, key2, index);
  }

  function deleteAddressArrayByIndexByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    uint256 index
  ) external {
    s.deleteAddressArrayByIndexByKeys(key1, key2, key3, index);
  }

  function getUintByKey(bytes32 key) external view returns (uint256) {
    return s.getUintByKey(key);
  }

  function getUintByKeys(bytes32 key1, bytes32 key2) external view returns (uint256) {
    return s.getUintByKeys(key1, key2);
  }

  function getUintByKeys(
    bytes32 key1,
    bytes32 key2,
    address account
  ) external view returns (uint256) {
    return s.getUintByKeys(key1, key2, account);
  }

  function getStringByKey(bytes32 key) external view returns (string memory) {
    return s.getStringByKey(key);
  }

  function getStringByKeys(bytes32 key1, bytes32 key2) external view returns (string memory) {
    return s.getStringByKeys(key1, key2);
  }

  function getBytes32ByKey(bytes32 key) external view returns (bytes32) {
    return s.getBytes32ByKey(key);
  }

  function getBytes32ByKeys(bytes32 key1, bytes32 key2) external view returns (bytes32) {
    return s.getBytes32ByKeys(key1, key2);
  }

  function getBoolByKey(bytes32 key) external view returns (bool) {
    return s.getBoolByKey(key);
  }

  function getBoolByKeys(bytes32 key1, bytes32 key2) external view returns (bool) {
    return s.getBoolByKeys(key1, key2);
  }

  function getBoolByKeys(bytes32 key, address account) external view returns (bool) {
    return s.getBoolByKeys(key, account);
  }

  function getAddressByKey(bytes32 key) external view returns (address) {
    return s.getAddressByKey(key);
  }

  function getAddressByKeys(bytes32 key1, bytes32 key2) external view returns (address) {
    return s.getAddressByKeys(key1, key2);
  }

  function getAddressByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (address) {
    return s.getAddressByKeys(key1, key2, key3);
  }

  function getAddressBooleanByKey(bytes32 key, address account) external view returns (bool) {
    return s.getAddressBooleanByKey(key, account);
  }

  function getAddressBooleanByKeys(
    bytes32 key1,
    bytes32 key2,
    address account
  ) external view returns (bool) {
    return s.getAddressBooleanByKeys(key1, key2, account);
  }

  function getAddressBooleanByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address account
  ) external view returns (bool) {
    return s.getAddressBooleanByKeys(key1, key2, key3, account);
  }

  function countAddressArrayByKey(bytes32 key) external view returns (uint256) {
    return s.countAddressArrayByKey(key);
  }

  function countAddressArrayByKeys(bytes32 key1, bytes32 key2) external view returns (uint256) {
    return s.countAddressArrayByKeys(key1, key2);
  }

  function countAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (uint256) {
    return s.countAddressArrayByKeys(key1, key2, key3);
  }

  function getAddressArrayByKey(bytes32 key) external view returns (address[] memory) {
    return s.getAddressArrayByKey(key);
  }

  function getAddressArrayByKeys(bytes32 key1, bytes32 key2) external view returns (address[] memory) {
    return s.getAddressArrayByKeys(key1, key2);
  }

  function getAddressArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (address[] memory) {
    return s.getAddressArrayByKeys(key1, key2, key3);
  }

  function getAddressArrayItemPositionByKey(bytes32 key, address addressToFind) external view returns (uint256) {
    return s.getAddressArrayItemPositionByKey(key, addressToFind);
  }

  function getAddressArrayItemPositionByKeys(
    bytes32 key1,
    bytes32 key2,
    address addressToFind
  ) external view returns (uint256) {
    return s.getAddressArrayItemPositionByKeys(key1, key2, addressToFind);
  }

  function getAddressArrayItemPositionByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    address addressToFind
  ) external view returns (uint256) {
    return s.getAddressArrayItemPositionByKeys(key1, key2, key3, addressToFind);
  }

  function getAddressArrayItemByIndexByKey(bytes32 key, uint256 index) external view returns (address) {
    return s.getAddressArrayItemByIndexByKey(key, index);
  }

  function getAddressArrayItemByIndexByKeys(
    bytes32 key1,
    bytes32 key2,
    uint256 index
  ) external view returns (address) {
    return s.getAddressArrayItemByIndexByKeys(key1, key2, index);
  }

  function getAddressArrayItemByIndexByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    uint256 index
  ) external view returns (address) {
    return s.getAddressArrayItemByIndexByKeys(key1, key2, key3, index);
  }

  function setBytes32ArrayByKey(bytes32 key, bytes32 value) external {
    s.setBytes32ArrayByKey(key, value);
  }

  function setBytes32ArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 value
  ) external {
    s.setBytes32ArrayByKeys(key1, key2, value);
  }

  function setBytes32ArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    bytes32 value
  ) external {
    s.setBytes32ArrayByKeys(key1, key2, key3, value);
  }

  function countBytes32ArrayByKey(bytes32 key) external view returns (uint256) {
    return s.countBytes32ArrayByKey(key);
  }

  function countBytes32ArrayByKeys(bytes32 key1, bytes32 key2) external view returns (uint256) {
    return s.countBytes32ArrayByKeys(key1, key2);
  }

  function countBytes32ArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (uint256) {
    return s.countBytes32ArrayByKeys(key1, key2, key3);
  }

  function getBytes32ArrayByKey(bytes32 key) external view returns (bytes32[] memory) {
    return s.getBytes32ArrayByKey(key);
  }

  function getBytes32ArrayByKeys(bytes32 key1, bytes32 key2) external view returns (bytes32[] memory) {
    return s.getBytes32ArrayByKeys(key1, key2);
  }

  function getBytes32ArrayByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3
  ) external view returns (bytes32[] memory) {
    return s.getBytes32ArrayByKeys(key1, key2, key3);
  }

  function getBytes32ArrayItemPositionByKey(bytes32 key, bytes32 bytes32ToFind) external view returns (uint256) {
    return s.getBytes32ArrayItemPositionByKey(key, bytes32ToFind);
  }

  function getBytes32ArrayItemPositionByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 bytes32ToFind
  ) external view returns (uint256) {
    return s.getBytes32ArrayItemPositionByKeys(key1, key2, bytes32ToFind);
  }

  function getBytes32ArrayItemPositionByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    bytes32 bytes32ToFind
  ) external view returns (uint256) {
    return s.getBytes32ArrayItemPositionByKeys(key1, key2, key3, bytes32ToFind);
  }

  function getBytes32ArrayItemByIndexByKey(bytes32 key, uint256 index) external view returns (bytes32) {
    return s.getBytes32ArrayItemByIndexByKey(key, index);
  }

  function getBytes32ArrayItemByIndexByKeys(
    bytes32 key1,
    bytes32 key2,
    uint256 index
  ) external view returns (bytes32) {
    return s.getBytes32ArrayItemByIndexByKeys(key1, key2, index);
  }

  function getBytes32ArrayItemByIndexByKeys(
    bytes32 key1,
    bytes32 key2,
    bytes32 key3,
    uint256 index
  ) external view returns (bytes32) {
    return s.getBytes32ArrayItemByIndexByKeys(key1, key2, key3, index);
  }
}
