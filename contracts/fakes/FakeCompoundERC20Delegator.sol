// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.0;
import "../interfaces/external/ICompoundERC20DelegatorLike.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./FakeToken.sol";

contract FakeCompoundERC20Delegator is ICompoundERC20DelegatorLike, ERC20 {
  FakeToken public dai;
  FakeToken public cDai;

  constructor(FakeToken _dai, FakeToken _cDai) ERC20("cDAI", "cDAI") {
    dai = _dai;
    cDai = _cDai;
  }

  /**
   * @notice Sender supplies assets into the market and receives cTokens in exchange
   * @dev Accrues interest whether or not the operation succeeds, unless reverted
   * @param mintAmount The amount of the underlying asset to supply
   * @return uint 0=success, otherwise a failure (see ErrorReporter.sol for details)
   */
  function mint(uint256 mintAmount) external override returns (uint256) {
    dai.transferFrom(msg.sender, address(this), mintAmount);
    cDai.mint(msg.sender, mintAmount);

    return 0;
  }

  /**
   * @notice Sender redeems cTokens in exchange for the underlying asset
   * @dev Accrues interest whether or not the operation succeeds, unless reverted
   * @param redeemTokens The number of cTokens to redeem into underlying
   * @return uint 0=success, otherwise a failure (see ErrorReporter.sol for details)
   */
  function redeem(uint256 redeemTokens) external override returns (uint256) {
    cDai.transferFrom(msg.sender, address(this), redeemTokens);

    uint256 interest = (redeemTokens * 3) / 100;
    dai.mint(address(this), interest);

    dai.transfer(msg.sender, redeemTokens + interest);

    return 0;
  }
}
