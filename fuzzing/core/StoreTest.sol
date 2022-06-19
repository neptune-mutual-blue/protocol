// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../../contracts/core/store/Store.sol";

contract StoreTest is Test {
  Store public store;
  using stdStorage for StdStorage;

  function setUp() public {
    store = new Store();
  }

  function testSetUint(bytes32 key, uint256 value) public {
    store.setUint(key, value);
    assertEq(store.getUint(key), value);
  }

  function testSetUintAsNonMember(bytes32 key, uint256 value) public {
    vm.expectRevert("Forbidden");
    vm.prank(address(2));
    store.setUint(key, value);
  }
}
