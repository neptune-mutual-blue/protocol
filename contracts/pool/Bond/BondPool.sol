// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./BondPoolBase.sol";

contract BondPool is BondPoolBase {
  using BondPoolLibV1 for IStore;
  using ValidationLibV1 for IStore;

  constructor(IStore s) BondPoolBase(s) {} //solhint-disable-line

  /**
   * @dev Create a new bond contract by supplying your LP tokens
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   * @param lpTokens Enter liquidity pair token amount 
   * @param minNpmDesired Enter NPM amount you will get
   *
   */
  function createBond(uint256 lpTokens, uint256 minNpmDesired) external override nonReentrant {
    s.mustNotBePaused();

    require(lpTokens > 0, "Please specify `lpTokens`");
    require(minNpmDesired > 0, "Please enter `minNpmDesired`");

    uint256[] memory values = s.createBondInternal(lpTokens, minNpmDesired);
    emit BondCreated(msg.sender, lpTokens, values[0], values[1]);
  }

  /**
   * @dev Claim your bond and receive your NPM tokens after waiting period
   *
   * @custom:suppress-acl This is a publicly accessible feature
   *
   */
  function claimBond() external override nonReentrant {
    s.mustNotBePaused();

    // @suppress-zero-value-check The uint values are validated in the function `claimBondInternal`
    uint256[] memory values = s.claimBondInternal();
    emit BondClaimed(msg.sender, values[0]);
  }
}
