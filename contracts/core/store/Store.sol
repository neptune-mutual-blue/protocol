// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "./StoreBase.sol";

contract Store is StoreBase {
  function setAddress(bytes32 k, address v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    addressStorage[k] = v;
  }

  function setAddressBoolean(
    bytes32 k,
    address a,
    bool v
  ) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    addressBooleanStorage[k][a] = v;
  }

  function setUint(bytes32 k, uint256 v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    uintStorage[k] = v;
  }

  function addUint(bytes32 k, uint256 v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    uint256 existing = uintStorage[k];
    uintStorage[k] = existing + v;
  }

  function subtractUint(bytes32 k, uint256 v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    uint256 existing = uintStorage[k];
    uintStorage[k] = existing - v;
  }

  function setUints(bytes32 k, uint256[] memory v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    uintsStorage[k] = v;
  }

  function setString(bytes32 k, string calldata v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    stringStorage[k] = v;
  }

  function setBytes(bytes32 k, bytes calldata v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();
    bytesStorage[k] = v;
  }

  function setBool(bytes32 k, bool v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    if (v) {
      boolStorage[k] = v;
      return;
    }

    delete boolStorage[k];
  }

  function setInt(bytes32 k, int256 v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    intStorage[k] = v;
  }

  function setBytes32(bytes32 k, bytes32 v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    bytes32Storage[k] = v;
  }

  function setAddressArrayItem(bytes32 k, address v) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    if (addressArrayAddressPositionMap[k][v] == 0) {
      addressArrayStorage[k].push(v);
      addressArrayAddressPositionMap[k][v] = addressArrayStorage[k].length;
    }
  }

  function deleteAddress(bytes32 k) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    delete addressStorage[k];
  }

  function deleteUint(bytes32 k) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    delete uintStorage[k];
  }

  function deleteUints(bytes32 k) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    delete uintsStorage[k];
  }

  function deleteString(bytes32 k) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    delete stringStorage[k];
  }

  function deleteBytes(bytes32 k) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    delete bytesStorage[k];
  }

  function deleteBool(bytes32 k) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    delete boolStorage[k];
  }

  function deleteInt(bytes32 k) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    delete intStorage[k];
  }

  function deleteBytes32(bytes32 k) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    delete bytes32Storage[k];
  }

  function deleteAddressArrayItem(bytes32 k, address v) public override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    require(addressArrayAddressPositionMap[k][v] > 0, "Not found");

    uint256 i = addressArrayAddressPositionMap[k][v] - 1;
    uint256 count = addressArrayStorage[k].length;

    if (i + 1 != count) {
      addressArrayStorage[k][i] = addressArrayStorage[k][count - 1];
      address theThenLastAddress = addressArrayStorage[k][i];
      addressArrayAddressPositionMap[k][theThenLastAddress] = i + 1;
    }

    addressArrayStorage[k].pop();
    delete addressArrayAddressPositionMap[k][v];
  }

  function deleteAddressArrayItemByIndex(bytes32 k, uint256 i) external override {
    _throwIfPaused();
    _throwIfSenderNotProtocolMember();

    require(i < addressArrayStorage[k].length, "Invalid index");

    address v = addressArrayStorage[k][i];
    deleteAddressArrayItem(k, v);
  }

  function getAddressValues(bytes32[] memory keys) external view override returns (address[] memory values) {
    values = new address[](keys.length);

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

  function getUintValues(bytes32[] memory keys) external view override returns (uint256[] memory values) {
    values = new uint256[](keys.length);

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
    return addressArrayAddressPositionMap[k][toFind];
  }

  function getAddressArrayItemByIndex(bytes32 k, uint256 i) external view override returns (address) {
    require(addressArrayStorage[k].length > i, "Invalid index");
    return addressArrayStorage[k][i];
  }

  function countAddressArrayItems(bytes32 k) external view override returns (uint256) {
    return addressArrayStorage[k].length;
  }
}
