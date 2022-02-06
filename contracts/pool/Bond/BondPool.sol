// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./BondPoolBase.sol";

contract BondPool is BondPoolBase {
  using BondPoolLibV1 for IStore;
  using ValidationLibV1 for IStore;

  constructor(IStore s) BondPoolBase(s) {} //solhint-disable-line

  function createBond(uint256 lpTokens, uint256 minNpmDesired) external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible

    s.mustNotBePaused();

    uint256[] memory values = s.createBondInternal(lpTokens, minNpmDesired);
    emit BondCreated(msg.sender, lpTokens, values[0], values[1]);
  }

  function claimBond() external override nonReentrant {
    // @suppress-acl Marking this as publicly accessible
    s.mustNotBePaused();

    uint256[] memory values = s.claimBondInternal();
    emit BondClaimed(msg.sender, values[0]);
  }
}
