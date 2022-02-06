// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/external/IAaveV2LendingPoolLike.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./FakeToken.sol";

contract FakeAaveLendingPool is IAaveV2LendingPoolLike, ERC20 {
  FakeToken public aToken;

  constructor(FakeToken _aToken) ERC20("aDAI", "aDAI") {
    aToken = _aToken;
  }

  function deposit(
    address asset,
    uint256 amount,
    address,
    uint16
  ) external override {
    IERC20(asset).transferFrom(msg.sender, address(this), amount);
    aToken.mint(msg.sender, amount);
  }

  function withdraw(
    address asset,
    uint256 amount,
    address to
  ) external override returns (uint256) {
    aToken.transferFrom(msg.sender, address(this), amount);

    FakeToken dai = FakeToken(asset);

    uint256 interest = (amount * 10) / 100;
    dai.mint(address(this), interest);

    dai.transfer(to, amount + interest);

    return amount;
  }
}
