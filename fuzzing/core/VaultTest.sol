// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

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
    vm.assume(amount > 0 && amount < DEPOSIT_THRESHOLD);
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < NPM_DEPOSIT_THRESHOLD);

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    IVault.AddLiquidityArgs memory args;

    args.coverKey = _COVER_KEY;
    args.amount = amount;
    args.npmStakeToAdd = npmStakeToAdd;
    args.referralCode = referralCode;

    _vault.addLiquidity(args);
  }

  function testRemoveLiquidityWithdrawalNotStarted(
    uint256 amount,
    uint256 npmStakeToAdd,
    bytes32 referralCode
  ) public {
    vm.assume(amount > 0 && amount < DEPOSIT_THRESHOLD);
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < NPM_DEPOSIT_THRESHOLD);

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    IVault.AddLiquidityArgs memory args;

    args.coverKey = _COVER_KEY;
    args.amount = amount;
    args.npmStakeToAdd = npmStakeToAdd;
    args.referralCode = referralCode;

    _vault.addLiquidity(args);

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
    vm.assume(amount > 0 && amount < DEPOSIT_THRESHOLD);
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < NPM_DEPOSIT_THRESHOLD);

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    IVault.AddLiquidityArgs memory args;

    args.coverKey = _COVER_KEY;
    args.amount = amount;
    args.npmStakeToAdd = npmStakeToAdd;
    args.referralCode = referralCode;

    _vault.addLiquidity(args);

    vm.warp(block.timestamp + 1 days);

    RoutineInvokerLibV1.updateStateAndLiquidityInternal(_store, _COVER_KEY);

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
    vm.assume(amount > 0 && amount < DEPOSIT_THRESHOLD);
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < NPM_DEPOSIT_THRESHOLD);

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    IVault.AddLiquidityArgs memory args;

    args.coverKey = _COVER_KEY;
    args.amount = amount;
    args.npmStakeToAdd = npmStakeToAdd;
    args.referralCode = referralCode;

    _vault.addLiquidity(args);

    vm.warp(block.timestamp + 1 days);

    RoutineInvokerLibV1.updateStateAndLiquidityInternal(_store, _COVER_KEY);

    vm.roll(block.number + 2);
    vm.warp(block.timestamp + 180 days);

    uint256 podBalance = _vault.balanceOf(address(this));
    _vault.approve(address(_vault), podBalance);

    vm.expectRevert("Wait for accrual");
    _vault.removeLiquidity(_COVER_KEY, podBalance, npmStakeToAdd, true);
  }

  function testRemoveLiquidityPasses(
    uint256 amount,
    uint256 npmStakeToAdd,
    bytes32 referralCode
  ) public {
    vm.assume(amount > 0 && amount < DEPOSIT_THRESHOLD);
    vm.assume(npmStakeToAdd > 5000 ether && npmStakeToAdd < NPM_DEPOSIT_THRESHOLD);

    _dai.mint(amount);
    _dai.approve(address(_vault), amount);

    _npm.mint(npmStakeToAdd);
    _npm.approve(address(_vault), npmStakeToAdd);

    IVault.AddLiquidityArgs memory args;

    args.coverKey = _COVER_KEY;
    args.amount = amount;
    args.npmStakeToAdd = npmStakeToAdd;
    args.referralCode = referralCode;

    _vault.addLiquidity(args);

    vm.warp(block.timestamp + 1 days);

    RoutineInvokerLibV1.updateStateAndLiquidityInternal(_store, _COVER_KEY);

    vm.roll(block.number + 2);
    vm.warp(block.timestamp + 180 days);

    _vault.accrueInterest();

    uint256 podBalance = _vault.balanceOf(address(this));
    _vault.approve(address(_vault), podBalance);

    console.log("POD balance", podBalance);

    _vault.removeLiquidity(_COVER_KEY, podBalance, npmStakeToAdd, true);
  }
}
