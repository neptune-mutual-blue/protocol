// SPDX-License-Identifier: BUSL-1.1
pragma solidity >=0.4.22 <0.9.0;

interface IStore {
  function setAddress(bytes32 k, address v) external;

  function setAddresses(bytes32 k, address[] memory v) external;

  function setUint(bytes32 k, uint256 v) external;

  function addUint(bytes32 k, uint256 v) external;

  function subtractUint(bytes32 k, uint256 v) external;

  function setUints(bytes32 k, uint256[] memory v) external;

  function setString(bytes32 k, string calldata v) external;

  function setStrings(bytes32 k, string[] calldata v) external;

  function setBytes(bytes32 k, bytes calldata v) external;

  function setBool(bytes32 k, bool v) external;

  function setBools(bytes32 k, bool[] memory v) external;

  function setInt(bytes32 k, int256 v) external;

  function setInts(bytes32 k, int256[] memory v) external;

  function setBytes32(bytes32 k, bytes32 v) external;

  function setBytes32s(bytes32 k, bytes32[] memory v) external;

  function deleteAddress(bytes32 k) external;

  function deleteAddresses(bytes32 k) external;

  function deleteUint(bytes32 k) external;

  function deleteUints(bytes32 k) external;

  function deleteString(bytes32 k) external;

  function deleteStrings(bytes32 k) external;

  function deleteBytes(bytes32 k) external;

  function deleteBool(bytes32 k) external;

  function deleteBools(bytes32 k) external;

  function deleteInt(bytes32 k) external;

  function deleteInts(bytes32 k) external;

  function deleteBytes32(bytes32 k) external;

  function deleteBytes32s(bytes32 k) external;

  function getAddress(bytes32 k) external view returns (address);

  function getAddresses(bytes32 k) external view returns (address[] memory);

  function getUint(bytes32 k) external view returns (uint256);

  function getUints(bytes32 k) external view returns (uint256[] memory);

  function getString(bytes32 k) external view returns (string memory);

  function getStrings(bytes32 k) external view returns (string[] memory);

  function getBytes(bytes32 k) external view returns (bytes memory);

  function getBool(bytes32 k) external view returns (bool);

  function getBools(bytes32 k) external view returns (bool[] memory);

  function getInt(bytes32 k) external view returns (int256);

  function getInts(bytes32 k) external view returns (int256[] memory);

  function getBytes32(bytes32 k) external view returns (bytes32);

  function getBytes32s(bytes32 k) external view returns (bytes32[] memory);
}
