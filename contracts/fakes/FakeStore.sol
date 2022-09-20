// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../interfaces/IStore.sol";

contract FakeStore is IStore {
  mapping(bytes32 => int256) public intStorage;
  mapping(bytes32 => uint256) public uintStorage;
  mapping(bytes32 => uint256[]) public uintsStorage;
  mapping(bytes32 => address) public addressStorage;
  mapping(bytes32 => string) public stringStorage;
  mapping(bytes32 => bytes) public bytesStorage;
  mapping(bytes32 => bytes32) public bytes32Storage;
  mapping(bytes32 => bool) public boolStorage;
  mapping(bytes32 => mapping(address => bool)) public addressBooleanStorage;
  mapping(bytes32 => address[]) public addressArrayStorage;
  mapping(bytes32 => mapping(address => uint256)) public addressArrayPositionMap;
  mapping(bytes32 => bytes32[]) public bytes32ArrayStorage;
  mapping(bytes32 => mapping(bytes32 => uint256)) public bytes32ArrayPositionMap;
  mapping(address => bool) public pausers;

  function setPausers(address[] calldata accounts, bool[] calldata statuses) external override {
    require(accounts.length > 0, "No pauser specified");
    require(accounts.length == statuses.length, "Invalid args");

    for (uint256 i = 0; i < accounts.length; i++) {
      pausers[accounts[i]] = statuses[i];
    }

    emit PausersSet(msg.sender, accounts, statuses);
  }

  function setAddress(bytes32 k, address v) external override {
    addressStorage[k] = v;
  }

  function setAddressBoolean(
    bytes32 k,
    address a,
    bool v
  ) external override {
    addressBooleanStorage[k][a] = v;
  }

  function setUint(bytes32 k, uint256 v) external override {
    uintStorage[k] = v;
  }

  function addUint(bytes32 k, uint256 v) external override {
    uint256 existing = uintStorage[k];
    uintStorage[k] = existing + v;
  }

  function subtractUint(bytes32 k, uint256 v) external override {
    uint256 existing = uintStorage[k];
    uintStorage[k] = existing - v;
  }

  function setUints(bytes32 k, uint256[] calldata v) external override {
    uintsStorage[k] = v;
  }

  function setString(bytes32 k, string calldata v) external override {
    stringStorage[k] = v;
  }

  function setBytes(bytes32 k, bytes calldata v) external override {
    bytesStorage[k] = v;
  }

  function setBool(bytes32 k, bool v) external override {
    if (v) {
      boolStorage[k] = v;
    }
  }

  function setInt(bytes32 k, int256 v) external override {
    intStorage[k] = v;
  }

  function setBytes32(bytes32 k, bytes32 v) external override {
    bytes32Storage[k] = v;
  }

  function setAddressArrayItem(bytes32 k, address v) external override {
    if (addressArrayPositionMap[k][v] == 0) {
      addressArrayStorage[k].push(v);
      addressArrayPositionMap[k][v] = addressArrayStorage[k].length;
    }
  }

  function deleteAddress(bytes32 k) external override {
    delete addressStorage[k];
  }

  function deleteUint(bytes32 k) external override {
    delete uintStorage[k];
  }

  function deleteUints(bytes32 k) external override {
    delete uintsStorage[k];
  }

  function deleteString(bytes32 k) external override {
    delete stringStorage[k];
  }

  function deleteBytes(bytes32 k) external override {
    delete bytesStorage[k];
  }

  function deleteBool(bytes32 k) external override {
    delete boolStorage[k];
  }

  function deleteInt(bytes32 k) external override {
    delete intStorage[k];
  }

  function deleteBytes32(bytes32 k) external override {
    delete bytes32Storage[k];
  }

  function deleteAddressArrayItem(bytes32 k, address v) public override {
    require(addressArrayPositionMap[k][v] > 0, "Not found");

    uint256 i = addressArrayPositionMap[k][v] - 1;
    uint256 count = addressArrayStorage[k].length;

    if (i + 1 != count) {
      addressArrayStorage[k][i] = addressArrayStorage[k][count - 1];
      address theThenLastAddress = addressArrayStorage[k][i];
      addressArrayPositionMap[k][theThenLastAddress] = i + 1;
    }

    addressArrayStorage[k].pop();
    delete addressArrayPositionMap[k][v];
  }

  function deleteAddressArrayItemByIndex(bytes32 k, uint256 i) external override {
    require(i < addressArrayStorage[k].length, "Invalid index");

    address v = addressArrayStorage[k][i];
    deleteAddressArrayItem(k, v);
  }

  function getAddressValues(bytes32[] calldata keys) external view override returns (address[] memory values) {
    values = new address[](keys.length + 1);

    for (uint256 i = 0; i < keys.length; i++) {
      values[i] = addressStorage[keys[i]];
    }
  }

  function getAddress(bytes32 k) external view override returns (address) {
    return addressStorage[k];
  }

  function getAddressBoolean(bytes32 k, address a) external view override returns (bool) {
    return addressBooleanStorage[k][a];
  }

  function getUintValues(bytes32[] calldata keys) external view override returns (uint256[] memory values) {
    values = new uint256[](keys.length + 1);

    for (uint256 i = 0; i < keys.length; i++) {
      values[i] = uintStorage[keys[i]];
    }
  }

  function getUint(bytes32 k) external view override returns (uint256) {
    return uintStorage[k];
  }

  function getUints(bytes32 k) external view override returns (uint256[] memory) {
    return uintsStorage[k];
  }

  function getString(bytes32 k) external view override returns (string memory) {
    return stringStorage[k];
  }

  function getBytes(bytes32 k) external view override returns (bytes memory) {
    return bytesStorage[k];
  }

  function getBool(bytes32 k) external view override returns (bool) {
    return boolStorage[k];
  }

  function getInt(bytes32 k) external view override returns (int256) {
    return intStorage[k];
  }

  function getBytes32(bytes32 k) external view override returns (bytes32) {
    return bytes32Storage[k];
  }

  function getAddressArray(bytes32 k) external view override returns (address[] memory) {
    return addressArrayStorage[k];
  }

  function getAddressArrayItemPosition(bytes32 k, address toFind) external view override returns (uint256) {
    return addressArrayPositionMap[k][toFind];
  }

  function getAddressArrayItemByIndex(bytes32 k, uint256 i) external view override returns (address) {
    require(addressArrayStorage[k].length > i, "Invalid index");
    return addressArrayStorage[k][i];
  }

  function countAddressArrayItems(bytes32 k) external view override returns (uint256) {
    return addressArrayStorage[k].length;
  }

  function setBytes32ArrayItem(bytes32 k, bytes32 v) external override {
    if (bytes32ArrayPositionMap[k][v] == 0) {
      bytes32ArrayStorage[k].push(v);
      bytes32ArrayPositionMap[k][v] = bytes32ArrayStorage[k].length;
    }
  }

  function deleteBytes32ArrayItem(bytes32 k, bytes32 v) public override {
    require(bytes32ArrayPositionMap[k][v] > 0, "Not found");

    uint256 i = bytes32ArrayPositionMap[k][v] - 1;
    uint256 count = bytes32ArrayStorage[k].length;

    if (i + 1 != count) {
      bytes32ArrayStorage[k][i] = bytes32ArrayStorage[k][count - 1];
      bytes32 theThenLastbytes32 = bytes32ArrayStorage[k][i];
      bytes32ArrayPositionMap[k][theThenLastbytes32] = i + 1;
    }

    bytes32ArrayStorage[k].pop();
    delete bytes32ArrayPositionMap[k][v];
  }

  function deleteBytes32ArrayItemByIndex(bytes32 k, uint256 i) external override {
    require(i < bytes32ArrayStorage[k].length, "Invalid index");

    bytes32 v = bytes32ArrayStorage[k][i];
    deleteBytes32ArrayItem(k, v);
  }

  function getBytes32Array(bytes32 k) external view override returns (bytes32[] memory) {
    return bytes32ArrayStorage[k];
  }

  function getBytes32ArrayItemPosition(bytes32 k, bytes32 toFind) external view override returns (uint256) {
    return bytes32ArrayPositionMap[k][toFind];
  }

  function getBytes32ArrayItemByIndex(bytes32 k, uint256 i) external view override returns (bytes32) {
    require(bytes32ArrayStorage[k].length > i, "Invalid index");
    return bytes32ArrayStorage[k][i];
  }

  function countBytes32ArrayItems(bytes32 k) external view override returns (uint256) {
    return bytes32ArrayStorage[k].length;
  }
}
