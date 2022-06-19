// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.0;

import "../CoverSpec.sol"; // <-- imports "Test.sol" and other setups

contract VaultTest is CoverSpec {
  function setUp() public {}

  function testAddLiquidity(
    uint256 amount,
    uint256 npmStakeToAdd,
    bytes32 referralCode
  ) public {
    vm.assume(amount > 0 && amount < type(uint256).max / 1 ether); // avoid “phantom overflow”
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < type(uint256).max / 1 ether);

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    _vault.addLiquidity(_COVER_KEY, amount, npmStakeToAdd, referralCode);
  }
}
