// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;
import "../dependencies/compound/ICompoundERC20DelegatorLike.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./FakeToken.sol";

contract FakeCompoundStablecoinDelegator is ICompoundERC20DelegatorLike, ERC20 {
  FakeToken public stablecoin;
  FakeToken public cStablecoin;

  constructor(FakeToken _stablecoin, FakeToken _cStablecoin) ERC20("cStablecoin", "cStablecoin") {
    stablecoin = _stablecoin;
    cStablecoin = _cStablecoin;
  }

  /**
   * @notice Sender supplies assets into the market and receives cTokens in exchange
   * @dev Accrues interest whether or not the operation succeeds, unless reverted
   * @param mintAmount The amount of the underlying asset to supply
   * @return uint 0=success, otherwise a failure (see ErrorReporter.sol for details)
   */
  function mint(uint256 mintAmount) external override returns (uint256) {
    stablecoin.transferFrom(msg.sender, address(this), mintAmount);

    cStablecoin.mint(mintAmount);
    cStablecoin.transfer(msg.sender, mintAmount);

    return 0;
  }

  /**
   * @notice Sender redeems cTokens in exchange for the underlying asset
   * @dev Accrues interest whether or not the operation succeeds, unless reverted
   * @param redeemTokens The number of cTokens to redeem into underlying
   * @return uint 0=success, otherwise a failure (see ErrorReporter.sol for details)
   */
  function redeem(uint256 redeemTokens) external override returns (uint256) {
    cStablecoin.transferFrom(msg.sender, address(this), redeemTokens);

    uint256 interest = (redeemTokens * 3) / 100;
    stablecoin.mint(interest);

    stablecoin.transfer(msg.sender, redeemTokens + interest);

    return 0;
  }
}
