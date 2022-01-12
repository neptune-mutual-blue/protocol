// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../../fakes/FakeStore.sol";

contract MockStore is FakeStore {
  function setBool(bytes32 prefix, address a) public {
    bytes32 k = keccak256(abi.encodePacked(prefix, a));
    this.setBool(k, true);
  }

  function unsetBool(bytes32 prefix, address a) public {
    bytes32 k = keccak256(abi.encodePacked(prefix, a));
    this.deleteBool(k);
  }

  function setAddress(
    bytes32 k1,
    bytes32 k2,
    address v
  ) public {
    this.setAddress(keccak256(abi.encodePacked(k1, k2)), v);
  }

  function setAddress(
    bytes32 k1,
    bytes32 k2,
    bytes32 k3,
    address v
  ) public {
    this.setAddress(keccak256(abi.encodePacked(k1, k2, k3)), v);
  }

  function setUint(
    bytes32 k1,
    bytes32 k2,
    uint256 v
  ) public {
    this.setUint(keccak256(abi.encodePacked(k1, k2)), v);
  }
}
