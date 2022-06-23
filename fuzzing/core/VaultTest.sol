// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.0;

// imports "Test.sol" and other setups
import "../CoverSpec.sol";

contract VaultTest is CoverSpec {
  uint256 public constant NPM_PRECISION = 1 ether;
  using StoreKeyUtil for Store;

  function setUp() public view {
    this;
  }

  function testAddLiquidity(
    uint256 amount,
    uint256 npmStakeToAdd,
    bytes32 referralCode
  ) public {
    vm.assume(amount > 0 && amount < type(uint256).max / ProtoUtilV1.POD_PRECISION); // avoid “phantom overflow”
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < type(uint256).max / NPM_PRECISION); // avoid “phantom overflow”

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    _vault.addLiquidity(_COVER_KEY, amount, npmStakeToAdd, referralCode);
  }

  function testRemoveLiquidityWithdrawalNotStarted(
    uint256 amount,
    uint256 npmStakeToAdd,
    bytes32 referralCode
  ) public {
    vm.assume(amount > 0 && amount < type(uint256).max / ProtoUtilV1.POD_PRECISION); // avoid “phantom overflow”
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < type(uint256).max / NPM_PRECISION); // avoid “phantom overflow”

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    _vault.addLiquidity(_COVER_KEY, amount, npmStakeToAdd, referralCode);

    vm.roll(block.number + 2);

    uint256 podBalance = _vault.balanceOf(address(this));
    _vault.approve(address(_vault), podBalance);

    vm.expectRevert("Withdrawal period has not started");
    _vault.removeLiquidity(_COVER_KEY, podBalance, npmStakeToAdd, true);
  }

  function testRemoveLiquidityWithdrawalEnded(
    uint256 amount,
    uint256 npmStakeToAdd,
    bytes32 referralCode
  ) public {
    vm.assume(amount > 0 && amount < type(uint256).max / ProtoUtilV1.POD_PRECISION); // avoid “phantom overflow”
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < type(uint256).max / NPM_PRECISION); // avoid “phantom overflow”

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    _vault.addLiquidity(_COVER_KEY, amount, npmStakeToAdd, referralCode);

    vm.warp(block.timestamp + 1 days);

    RoutineInvokerLibV1.updateStateAndLiquidity(_store, _COVER_KEY);

    vm.roll(block.number + 2);
    vm.warp(block.timestamp + 1000 days);

    uint256 podBalance = _vault.balanceOf(address(this));
    _vault.approve(address(_vault), podBalance);

    vm.expectRevert("Withdrawal period has already ended");
    _vault.removeLiquidity(_COVER_KEY, podBalance, npmStakeToAdd, true);
  }

  function testRemoveLiquidityWaitForAccrual(
    uint256 amount,
    uint256 npmStakeToAdd,
    bytes32 referralCode
  ) public {
    vm.assume(amount > 0 && amount < type(uint256).max / ProtoUtilV1.POD_PRECISION); // avoid “phantom overflow”
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < type(uint256).max / NPM_PRECISION); // avoid “phantom overflow”

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    _vault.addLiquidity(_COVER_KEY, amount, npmStakeToAdd, referralCode);

    vm.warp(block.timestamp + 1 days);

    RoutineInvokerLibV1.updateStateAndLiquidity(_store, _COVER_KEY);

    vm.roll(block.number + 2);
    vm.warp(block.timestamp + 180 days);

    uint256 podBalance = _vault.balanceOf(address(this));
    _vault.approve(address(_vault), podBalance);

    vm.expectRevert("Wait for accrual");
    _vault.removeLiquidity(_COVER_KEY, podBalance, npmStakeToAdd, true);
  }

  function testRemoveLiquidityPasses() public {
    // vm.assume(amount > 0 && amount < type(uint256).max / ProtoUtilV1.POD_PRECISION); // avoid “phantom overflow”
    // vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < type(uint256).max / NPM_PRECISION); // avoid “phantom overflow”
    uint256 amount = 1366162943935665063033896206164661659239220373909;
    uint256 npmStakeToAdd = 1167243246090623276486907153326344530938113330980;
    bytes32 referralCode = 0xfd6ebf89c639c91f1d861cc5bee26cac023759be298f6f0e009c79f48fcb3124;

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    _vault.addLiquidity(_COVER_KEY, amount, npmStakeToAdd, referralCode);

    vm.warp(block.timestamp + 1 days);

    RoutineInvokerLibV1.updateStateAndLiquidity(_store, _COVER_KEY);

    vm.roll(block.number + 2);
    vm.warp(block.timestamp + 180 days);

    _vault.accrueInterest();

    uint256 podBalance = _vault.balanceOf(address(this));
    _vault.approve(address(_vault), podBalance);

    console.log("POD balance", podBalance);

    _vault.removeLiquidity(_COVER_KEY, podBalance, npmStakeToAdd, true);
  }
}
