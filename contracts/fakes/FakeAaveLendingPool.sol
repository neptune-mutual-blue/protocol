// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/external/IAaveV2LendingPoolLike.sol";

contract FakeAaveLendingPool is IAaveV2LendingPoolLike {
  uint256 private _meaninglessStorage = 0;

  function deposit(
    address,
    uint256,
    address,
    uint16
  ) external override {
    _meaninglessStorage = block.number;
    // require(0 == 1, "We throw. So What?");
  }

  function withdraw(
    address,
    uint256 amount,
    address
  ) external override returns (uint256) {
    _meaninglessStorage = block.number;
    return amount;
  }
}
